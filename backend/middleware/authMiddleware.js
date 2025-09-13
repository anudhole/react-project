import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate JWT tokens
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied. No valid token provided.' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user and attach to request
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          message: 'User not found. Token may be invalid.' 
        });
      }

      if (!user.isActive) {
        return res.status(401).json({ 
          message: 'Account is deactivated. Please contact support.' 
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({ 
        message: 'Invalid token. Please login again.' 
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ 
      message: 'Authentication error occurred.' 
    });
  }
};

// Middleware to check if user is admin (for future use)
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({ 
      message: 'Authorization error occurred.' 
    });
  }
};

// Middleware to validate resource ownership
export const requireOwnership = (resourceModel) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user._id;

      const resource = await resourceModel.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ 
          message: 'Resource not found.' 
        });
      }

      // Check if user owns the resource
      if (resource.user.toString() !== userId.toString()) {
        return res.status(403).json({ 
          message: 'Access denied. You can only access your own resources.' 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership validation error:', error);
      res.status(500).json({ 
        message: 'Ownership validation error occurred.' 
      });
    }
  };
};

// Rate limiting middleware (simple implementation)
const requestCounts = new Map();

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const clientId = req.ip || req.user?._id || 'anonymous';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [id, requests] of requestCounts) {
      const filteredRequests = requests.filter(timestamp => timestamp > windowStart);
      if (filteredRequests.length === 0) {
        requestCounts.delete(id);
      } else {
        requestCounts.set(id, filteredRequests);
      }
    }

    // Check current client
    const clientRequests = requestCounts.get(clientId) || [];
    const recentRequests = clientRequests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add current request
    recentRequests.push(now);
    requestCounts.set(clientId, recentRequests);

    next();
  };
};

export default {
  authenticate,
  requireAdmin,
  requireOwnership,
  rateLimit
};