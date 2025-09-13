import express from 'express';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { authenticate, requireOwnership } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/trips
// @desc    Get all user trips
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'startDate', sortOrder = 'desc' } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;

    const sortOptions = {};
    if (sortBy === 'startDate') {
      sortOptions['dates.startDate'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'created') {
      sortOptions['createdAt'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'title') {
      sortOptions['title'] = sortOrder === 'asc' ? 1 : -1;
    }

    const trips = await Trip.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('title destination dates duration travelers budget.estimated status notes createdAt');

    const total = await Trip.countDocuments(query);

    res.json({
      trips,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error while fetching trips' });
  }
});

// @route   GET /api/trips/:id
// @desc    Get single trip
// @access  Private
router.get('/:id', authenticate, requireOwnership(Trip), async (req, res) => {
  try {
    res.json(req.resource); // Resource is attached by requireOwnership middleware
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Server error while fetching trip' });
  }
});

// @route   POST /api/trips
// @desc    Create new trip
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      title,
      destination,
      dates,
      travelers,
      budget,
      notes,
      status = 'planning'
    } = req.body;

    // Validation
    if (!title || !destination || !dates) {
      return res.status(400).json({
        message: 'Title, destination, and dates are required'
      });
    }

    if (!destination.country || !destination.city) {
      return res.status(400).json({
        message: 'Destination must include country and city'
      });
    }

    if (!dates.startDate || !dates.endDate) {
      return res.status(400).json({
        message: 'Start date and end date are required'
      });
    }

    // Validate dates
    const startDate = new Date(dates.startDate);
    const endDate = new Date(dates.endDate);
    
    if (startDate >= endDate) {
      return res.status(400).json({
        message: 'End date must be after start date'
      });
    }

    if (startDate < new Date()) {
      return res.status(400).json({
        message: 'Start date cannot be in the past'
      });
    }

    const trip = new Trip({
      user: req.user._id,
      title: title.trim(),
      destination: {
        country: destination.country.trim(),
        city: destination.city.trim(),
        coordinates: destination.coordinates
      },
      dates: {
        startDate,
        endDate
      },
      travelers: travelers || { adults: 1, children: 0 },
      budget: budget || {},
      notes: notes?.trim(),
      status
    });

    await trip.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.tripsPlanned': 1 }
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({ message: 'Server error during trip creation' });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update trip
// @access  Private
router.put('/:id', authenticate, requireOwnership(Trip), async (req, res) => {
  try {
    const allowedUpdates = [
      'title', 'destination', 'dates', 'travelers', 
      'budget', 'notes', 'status', 'itinerary'
    ];
    
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Validate dates if being updated
    if (updates.dates) {
      const startDate = new Date(updates.dates.startDate);
      const endDate = new Date(updates.dates.endDate);
      
      if (startDate >= endDate) {
        return res.status(400).json({
          message: 'End date must be after start date'
        });
      }
    }

    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({ message: 'Server error during trip update' });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete trip
// @access  Private
router.delete('/:id', authenticate, requireOwnership(Trip), async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.tripsPlanned': -1 }
    });

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error during trip deletion' });
  }
});

// @route   POST /api/trips/:id/share
// @desc    Share trip with others
// @access  Private
router.post('/:id/share', authenticate, requireOwnership(Trip), async (req, res) => {
  try {
    const { emails, permission = 'view' } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        message: 'At least one email address is required'
      });
    }

    const trip = req.resource;
    
    // Add shared users
    emails.forEach(email => {
      if (!trip.shared.sharedWith.find(share => share.email === email)) {
        trip.shared.sharedWith.push({
          email,
          permission,
          sharedAt: new Date()
        });
      }
    });

    await trip.save();

    // TODO: Send email notifications to shared users

    res.json({
      message: 'Trip shared successfully',
      sharedWith: trip.shared.sharedWith
    });
  } catch (error) {
    console.error('Share trip error:', error);
    res.status(500).json({ message: 'Server error during trip sharing' });
  }
});

// @route   PUT /api/trips/:id/status
// @desc    Update trip status
// @access  Private
router.put('/:id/status', authenticate, requireOwnership(Trip), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['planning', 'booked', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: 'Trip status updated successfully',
      status: trip.status
    });
  } catch (error) {
    console.error('Update trip status error:', error);
    res.status(500).json({ message: 'Server error during status update' });
  }
});

// @route   GET /api/trips/stats/overview
// @desc    Get trips overview stats
// @access  Private
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Trip.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget.estimated' }
        }
      }
    ]);

    const overview = {
      total: 0,
      planning: 0,
      booked: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      totalBudget: 0
    };

    stats.forEach(stat => {
      overview.total += stat.count;
      overview.totalBudget += stat.totalBudget || 0;
      
      switch (stat._id) {
        case 'planning':
          overview.planning = stat.count;
          break;
        case 'booked':
          overview.booked = stat.count;
          break;
        case 'in-progress':
          overview.inProgress = stat.count;
          break;
        case 'completed':
          overview.completed = stat.count;
          break;
        case 'cancelled':
          overview.cancelled = stat.count;
          break;
      }
    });

    res.json(overview);
  } catch (error) {
    console.error('Get trip stats error:', error);
    res.status(500).json({ message: 'Server error while fetching trip statistics' });
  }
});

export default router;