import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  destination: {
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  parameters: {
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 day']
    },
    travelers: {
      adults: {
        type: Number,
        required: true,
        min: [1, 'At least 1 adult traveler is required']
      },
      children: {
        type: Number,
        default: 0,
        min: [0, 'Children count cannot be negative']
      }
    },
    travelStyle: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      required: true
    },
    season: {
      type: String,
      enum: ['low', 'shoulder', 'high'],
      required: true
    }
  },
  estimation: {
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
      default: 'USD'
    },
    breakdown: {
      accommodation: {
        dailyRate: {
          type: Number,
          required: true
        },
        total: {
          type: Number,
          required: true
        },
        description: String
      },
      food: {
        dailyRate: {
          type: Number,
          required: true
        },
        total: {
          type: Number,
          required: true
        },
        description: String
      },
      transportation: {
        local: {
          dailyRate: {
            type: Number,
            required: true
          },
          total: {
            type: Number,
            required: true
          }
        },
        flights: {
          type: Number,
          default: 0
        },
        total: {
          type: Number,
          required: true
        },
        description: String
      },
      activities: {
        dailyRate: {
          type: Number,
          required: true
        },
        total: {
          type: Number,
          required: true
        },
        description: String
      },
      shopping: {
        total: {
          type: Number,
          default: 0
        },
        description: String
      },
      miscellaneous: {
        total: {
          type: Number,
          default: 0
        },
        description: String
      }
    },
    subtotal: {
      type: Number,
      required: true
    },
    contingency: {
      percentage: {
        type: Number,
        default: 10,
        min: [0, 'Contingency percentage cannot be negative'],
        max: [50, 'Contingency percentage cannot exceed 50%']
      },
      amount: {
        type: Number,
        required: true
      }
    },
    total: {
      type: Number,
      required: true
    }
  },
  recommendations: [{
    category: {
      type: String,
      enum: ['accommodation', 'food', 'transportation', 'activities', 'general']
    },
    title: String,
    description: String,
    estimatedSavings: Number
  }],
  metadata: {
    calculationMethod: {
      type: String,
      default: 'standard'
    },
    dataSource: {
      type: String,
      default: 'internal'
    },
    confidenceScore: {
      type: Number,
      min: [0, 'Confidence score cannot be negative'],
      max: [100, 'Confidence score cannot exceed 100']
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes
budgetSchema.index({ user: 1, createdAt: -1 });
budgetSchema.index({ 'destination.country': 1 });
budgetSchema.index({ trip: 1 });

// Calculate totals before saving
budgetSchema.pre('save', function(next) {
  const breakdown = this.estimation.breakdown;
  
  // Calculate subtotal
  this.estimation.subtotal = 
    breakdown.accommodation.total +
    breakdown.food.total +
    breakdown.transportation.total +
    breakdown.activities.total +
    breakdown.shopping.total +
    breakdown.miscellaneous.total;
  
  // Calculate contingency amount
  this.estimation.contingency.amount = 
    (this.estimation.subtotal * this.estimation.contingency.percentage) / 100;
  
  // Calculate total
  this.estimation.total = this.estimation.subtotal + this.estimation.contingency.amount;
  
  next();
});

// Virtual for per-person cost
budgetSchema.virtual('perPersonCost').get(function() {
  const totalTravelers = this.parameters.travelers.adults + this.parameters.travelers.children;
  return this.estimation.total / totalTravelers;
});

// Virtual for per-day cost
budgetSchema.virtual('perDayCost').get(function() {
  return this.estimation.total / this.parameters.duration;
});

// Method to get budget summary
budgetSchema.methods.getSummary = function() {
  return {
    id: this._id,
    destination: `${this.destination.city}, ${this.destination.country}`,
    duration: this.parameters.duration,
    travelers: this.parameters.travelers.adults + this.parameters.travelers.children,
    travelStyle: this.parameters.travelStyle,
    total: this.estimation.total,
    currency: this.estimation.currency,
    perPerson: this.perPersonCost,
    perDay: this.perDayCost,
    createdAt: this.createdAt
  };
};

// Static method to get average costs by destination
budgetSchema.statics.getAverageCosts = function(country, city) {
  return this.aggregate([
    {
      $match: {
        'destination.country': country,
        'destination.city': city
      }
    },
    {
      $group: {
        _id: {
          country: '$destination.country',
          city: '$destination.city',
          travelStyle: '$parameters.travelStyle'
        },
        avgTotal: { $avg: '$estimation.total' },
        avgAccommodation: { $avg: '$estimation.breakdown.accommodation.dailyRate' },
        avgFood: { $avg: '$estimation.breakdown.food.dailyRate' },
        avgTransportation: { $avg: '$estimation.breakdown.transportation.local.dailyRate' },
        avgActivities: { $avg: '$estimation.breakdown.activities.dailyRate' },
        count: { $sum: 1 }
      }
    }
  ]);
};

export default mongoose.model('Budget', budgetSchema);