import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify the JWT token and identify the authenticated user.
export const protect = async (req, res, next) => {
try {
const authHeader = req.headers.authorization;

// Require a Bearer token.
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({
    success: false,
    message: 'Authentication required. Please log in.',
  });
}

const token = authHeader.split(' ')[1];

if (!token) {
  return res.status(401).json({
    success: false,
    message: 'Authentication token is missing.',
  });
}

if (!process.env.JWT_SECRET) {
  return res.status(500).json({
    success: false,
    message: 'Authentication configuration error.',
  });
}

// Verify the token's signature and expiration.
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// Retrieve the current user from the database.
const user = await User.findById(decoded.id);

if (!user || !user.isActive) {
  return res.status(401).json({
    success: false,
    message: 'User account is unavailable. Please log in again.',
  });
}

// Attach the authenticated user to the request.
req.user = user;

next();

} catch (error) {
if (
error.name === 'JsonWebTokenError' ||
error.name === 'TokenExpiredError' ||
error.name === 'NotBeforeError'
) {
return res.status(401).json({
success: false,
message: 'Invalid or expired authentication token.',
});
}

next(error);

}
};

// Restrict endpoints to users with specified roles.
export const authorizeRoles = (...allowedRoles) => {
return (req, res, next) => {
if (!req.user) {
return res.status(401).json({
success: false,
message: 'Authentication required.',
});
}

if (!allowedRoles.includes(req.user.role)) {
  return res.status(403).json({
    success: false,
    message: 'You are not authorized to access this resource.',
  });
}

next();

};
};