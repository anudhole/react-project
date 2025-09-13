import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    maxlength: [100, 'Trip title must be less than 100 characters']
  },
  destination: {
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  dates: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    }
  },
  duration: {
    type: Number, // days
    required: true
  },
  travelers: {
    adults: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 adult traveler is required']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children count cannot be negative']
    }
  },
  budget: {
    estimated: {
      type: Number,
      min: [0, 'Budget cannot be negative']
    },
    actual: {
      type: Number,
      default: 0,
      min: [0, 'Actual spending cannot be negative']
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
      default: 'USD'
    },
    breakdown: {
      accommodation: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 }
    }
  },
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    activities: [{
      time: String,
      activity: String,
      location: String,
      notes: String,
      estimatedCost: Number
    }],
    accommodation: {
      name: String,
      address: String,
      checkIn: Date,
      checkOut: Date,
      cost: Number
    },
    transportation: [{
      type: {
        type: String,
        enum: ['flight', 'train', 'bus', 'car', 'taxi', 'walk', 'subway']
      },
      from: String,
      to: String,
      time: String,
      cost: Number,
      bookingReference: String
    }]
  }],
  status: {
    type: String,
    enum: ['planning', 'booked', 'in-progress', 'completed', 'cancelled'],
    default: 'planning'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes must be less than 1000 characters']
  },
  photos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  shared: {
    isPublic: {
      type: Boolean,
      default: false
    },
    sharedWith: [{
      email: String,
      permission: {
        type: String,
        enum: ['view', 'edit'],
        default: 'view'
      },
      sharedAt: {
        type: Date,
        default: Date.now
      }
    }],
    shareToken: {
      type: String,
      unique: true,
      sparse: true
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
tripSchema.index({ user: 1, 'dates.startDate': -1 });
tripSchema.index({ 'destination.country': 1 });
tripSchema.index({ status: 1 });

// Calculate trip duration before saving
tripSchema.pre('save', function(next) {
  if (this.dates.startDate && this.dates.endDate) {
    const timeDiff = this.dates.endDate.getTime() - this.dates.startDate.getTime();
    this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  next();
});

// Virtual for total travelers
tripSchema.virtual('totalTravelers').get(function() {
  return this.travelers.adults + this.travelers.children;
});

// Method to calculate total budget
tripSchema.methods.getTotalBudget = function() {
  const breakdown = this.budget.breakdown;
  return Object.values(breakdown).reduce((total, amount) => total + (amount || 0), 0);
};

// Method to get trip summary
tripSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    destination: `${this.destination.city}, ${this.destination.country}`,
    duration: this.duration,
    totalTravelers: this.totalTravelers,
    totalBudget: this.getTotalBudget(),
    status: this.status,
    startDate: this.dates.startDate,
    endDate: this.dates.endDate
  };
};

export default mongoose.model('Trip', tripSchema);