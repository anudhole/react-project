import express from 'express';
import Budget from '../models/Budget.js';
import { authenticate, requireOwnership } from '../middleware/authMiddleware.js';

const router = express.Router();

// Budget calculation constants (per day rates in USD)
const BUDGET_RATES = {
  accommodation: {
    budget: { base: 25, multiplier: 1.0 },
    'mid-range': { base: 60, multiplier: 1.2 },
    luxury: { base: 150, multiplier: 1.5 }
  },
  food: {
    budget: { base: 20, multiplier: 1.0 },
    'mid-range': { base: 40, multiplier: 1.1 },
    luxury: { base: 80, multiplier: 1.3 }
  },
  transportation: {
    budget: { base: 10, multiplier: 1.0 },
    'mid-range': { base: 25, multiplier: 1.1 },
    luxury: { base: 50, multiplier: 1.2 }
  },
  activities: {
    budget: { base: 15, multiplier: 1.0 },
    'mid-range': { base: 35, multiplier: 1.2 },
    luxury: { base: 75, multiplier: 1.5 }
  }
};

// Country/region multipliers
const COUNTRY_MULTIPLIERS = {
  // Western Europe
  'France': 1.2,
  'Germany': 1.1,
  'Italy': 1.0,
  'Spain': 0.9,
  'United Kingdom': 1.3,
  
  // Asia
  'Japan': 1.4,
  'South Korea': 1.1,
  'Thailand': 0.4,
  'Vietnam': 0.3,
  'India': 0.2,
  
  // North America
  'United States': 1.5,
  'Canada': 1.2,
  
  // Default
  'default': 1.0
};

// @route   POST /api/budget/estimate
// @desc    Calculate budget estimate
// @access  Private
router.post('/estimate', authenticate, async (req, res) => {
  try {
    const {
      destination,
      duration,
      travelers,
      travelStyle,
      season = 'shoulder'
    } = req.body;

    // Validation
    if (!destination || !destination.country || !destination.city) {
      return res.status(400).json({
        message: 'Destination with country and city is required'
      });
    }

    if (!duration || duration < 1) {
      return res.status(400).json({
        message: 'Duration must be at least 1 day'
      });
    }

    if (!travelers || !travelers.adults || travelers.adults < 1) {
      return res.status(400).json({
        message: 'At least 1 adult traveler is required'
      });
    }

    if (!travelStyle || !['budget', 'mid-range', 'luxury'].includes(travelStyle)) {
      return res.status(400).json({
        message: 'Travel style must be one of: budget, mid-range, luxury'
      });
    }

    // Get base rates
    const rates = BUDGET_RATES;
    const countryMultiplier = COUNTRY_MULTIPLIERS[destination.country] || COUNTRY_MULTIPLIERS.default;
    
    // Season multiplier
    const seasonMultipliers = {
      low: 0.8,
      shoulder: 1.0,
      high: 1.3
    };
    const seasonMultiplier = seasonMultipliers[season];

    // Calculate costs
    const totalTravelers = travelers.adults + (travelers.children || 0);
    const childMultiplier = 0.7; // Children cost 70% of adult rates

    // Accommodation (per room, not per person)
    const accommodationDaily = rates.accommodation[travelStyle].base * 
                              rates.accommodation[travelStyle].multiplier * 
                              countryMultiplier * seasonMultiplier;
    const accommodationTotal = accommodationDaily * duration;

    // Food (per person)
    const foodDaily = rates.food[travelStyle].base * 
                      rates.food[travelStyle].multiplier * 
                      countryMultiplier * seasonMultiplier;
    const foodTotal = (foodDaily * travelers.adults + 
                       foodDaily * childMultiplier * (travelers.children || 0)) * duration;

    // Local transportation (per person)
    const transportDaily = rates.transportation[travelStyle].base * 
                          rates.transportation[travelStyle].multiplier * 
                          countryMultiplier;
    const localTransportTotal = (transportDaily * travelers.adults + 
                                transportDaily * childMultiplier * (travelers.children || 0)) * duration;

    // Flight estimate (simplified)
    const flightEstimate = 500 * totalTravelers * countryMultiplier;

    // Activities (per person)
    const activitiesDaily = rates.activities[travelStyle].base * 
                           rates.activities[travelStyle].multiplier * 
                           countryMultiplier * seasonMultiplier;
    const activitiesTotal = (activitiesDaily * travelers.adults + 
                            activitiesDaily * childMultiplier * (travelers.children || 0)) * duration;

    // Shopping and miscellaneous
    const shoppingTotal = duration * 20 * (travelStyle === 'luxury' ? 2 : travelStyle === 'mid-range' ? 1.5 : 1);
    const miscTotal = duration * 15;

    // Create budget estimation
    const budget = new Budget({
      user: req.user._id,
      destination: {
        country: destination.country,
        city: destination.city
      },
      parameters: {
        duration,
        travelers,
        travelStyle,
        season
      },
      estimation: {
        currency: 'USD',
        breakdown: {
          accommodation: {
            dailyRate: accommodationDaily,
            total: accommodationTotal,
            description: `${travelStyle} accommodation for ${duration} nights`
          },
          food: {
            dailyRate: foodDaily,
            total: foodTotal,
            description: `${travelStyle} dining for ${totalTravelers} travelers`
          },
          transportation: {
            local: {
              dailyRate: transportDaily,
              total: localTransportTotal
            },
            flights: flightEstimate,
            total: localTransportTotal + flightEstimate,
            description: `Local transport and flights for ${totalTravelers} travelers`
          },
          activities: {
            dailyRate: activitiesDaily,
            total: activitiesTotal,
            description: `${travelStyle} activities and attractions`
          },
          shopping: {
            total: shoppingTotal,
            description: 'Shopping and souvenirs'
          },
          miscellaneous: {
            total: miscTotal,
            description: 'Tips, emergencies, and unexpected expenses'
          }
        },
        contingency: {
          percentage: 10
        }
      },
      recommendations: generateRecommendations(travelStyle, destination.country),
      metadata: {
        calculationMethod: 'standard',
        dataSource: 'internal',
        confidenceScore: 75
      }
    });

    await budget.save();

    res.status(201).json({
      message: 'Budget estimate calculated successfully',
      budget: budget.getSummary(),
      detailed: budget
    });

  } catch (error) {
    console.error('Budget estimation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({ message: 'Server error during budget calculation' });
  }
});

// @route   GET /api/budget/history
// @desc    Get user's budget estimation history
// @access  Private
router.get('/history', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const budgets = await Budget.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('destination parameters estimation.total estimation.currency createdAt');

    const total = await Budget.countDocuments({ user: req.user._id });

    res.json({
      budgets: budgets.map(budget => budget.getSummary()),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get budget history error:', error);
    res.status(500).json({ message: 'Server error while fetching budget history' });
  }
});

// @route   GET /api/budget/:id
// @desc    Get detailed budget estimate
// @access  Private
router.get('/:id', authenticate, requireOwnership(Budget), async (req, res) => {
  try {
    res.json(req.resource);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ message: 'Server error while fetching budget' });
  }
});

// @route   GET /api/budget/destination/:country/:city
// @desc    Get average costs for a destination
// @access  Private
router.get('/destination/:country/:city', authenticate, async (req, res) => {
  try {
    const { country, city } = req.params;

    const averages = await Budget.getAverageCosts(country, city);

    if (averages.length === 0) {
      return res.json({
        message: 'No data available for this destination',
        averages: [],
        hasData: false
      });
    }

    res.json({
      destination: { country, city },
      averages,
      hasData: true
    });
  } catch (error) {
    console.error('Get destination averages error:', error);
    res.status(500).json({ message: 'Server error while fetching destination data' });
  }
});

// @route   DELETE /api/budget/:id
// @desc    Delete budget estimate
// @access  Private
router.delete('/:id', authenticate, requireOwnership(Budget), async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget estimate deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ message: 'Server error during budget deletion' });
  }
});

// Helper function to generate recommendations
function generateRecommendations(travelStyle, country) {
  const recommendations = [];

  if (travelStyle === 'budget') {
    recommendations.push(
      {
        category: 'accommodation',
        title: 'Consider Hostels and Budget Hotels',
        description: 'Look for hostels, guesthouses, or budget hotel chains to save on accommodation costs.',
        estimatedSavings: 200
      },
      {
        category: 'food',
        title: 'Eat Like a Local',
        description: 'Try street food, local markets, and neighborhood restaurants instead of tourist areas.',
        estimatedSavings: 150
      }
    );
  }

  if (travelStyle === 'luxury') {
    recommendations.push(
      {
        category: 'activities',
        title: 'Book Premium Experiences',
        description: 'Consider private tours, exclusive experiences, and premium activities for a memorable trip.',
        estimatedSavings: -300
      }
    );
  }

  // Country-specific recommendations
  if (country === 'Japan') {
    recommendations.push({
      category: 'transportation',
      title: 'Get a JR Pass',
      description: 'If traveling between cities, a Japan Rail Pass can save significantly on transportation.',
      estimatedSavings: 100
    });
  }

  if (country === 'Italy') {
    recommendations.push({
      category: 'food',
      title: 'Aperitivo Hours',
      description: 'Take advantage of aperitivo hours (6-8 PM) for discounted drinks and free appetizers.',
      estimatedSavings: 80
    });
  }

  // General recommendations
  recommendations.push({
    category: 'general',
    title: 'Travel Insurance',
    description: 'Consider comprehensive travel insurance to protect against unexpected costs.',
    estimatedSavings: 0
  });

  return recommendations;
}

export default router;