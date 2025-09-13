import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, preferences } = req.body;
    
    const updateData = {};
    
    if (name) updateData.name = name.trim();
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// @route   POST /api/user/avatar
// @desc    Update user avatar
// @access  Private
router.post('/avatar', authenticate, async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: 'Avatar URL is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );

    res.json({
      message: 'Avatar updated successfully',
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ message: 'Server error during avatar update' });
  }
});

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // TODO: Calculate more detailed stats from trips and budgets
    const stats = {
      ...user.stats,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', authenticate, async (req, res) => {
  try {
    const { currency, travelStyle, interests } = req.body;

    const updateData = {};
    
    if (currency) updateData['preferences.currency'] = currency;
    if (travelStyle) updateData['preferences.travelStyle'] = travelStyle;
    if (interests && Array.isArray(interests)) {
      updateData['preferences.interests'] = interests;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({ message: 'Server error during preferences update' });
  }
});

// @route   DELETE /api/user/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', authenticate, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to deactivate account' });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Deactivate account instead of deleting
    user.isActive = false;
    await user.save();

    res.json({
      message: 'Account deactivated successfully. Contact support to reactivate.'
    });
  } catch (error) {
    console.error('Account deactivation error:', error);
    res.status(500).json({ message: 'Server error during account deactivation' });
  }
});

export default router;