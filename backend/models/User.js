import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name must be less than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
      default: 'USD'
    },
    travelStyle: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      default: 'mid-range'
    },
    interests: [{
      type: String,
      enum: ['culture', 'adventure', 'relaxation', 'food', 'nightlife', 'nature', 'history', 'shopping']
    }]
  },
  stats: {
    tripsPlanned: {
      type: Number,
      default: 0
    },
    totalBudgetEstimated: {
      type: Number,
      default: 0
    },
    countriesVisited: [{
      type: String
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
});

// Index for better query performance
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update user stats when a trip is created
userSchema.methods.incrementTripsPlanned = function() {
  this.stats.tripsPlanned += 1;
  return this.save();
};

// Add visited country
userSchema.methods.addVisitedCountry = function(country) {
  if (!this.stats.countriesVisited.includes(country)) {
    this.stats.countriesVisited.push(country);
    return this.save();
  }
};

export default mongoose.model('User', userSchema);