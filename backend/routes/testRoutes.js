import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test that a valid JWT token is required.
router.get('/protected', protect, (req, res) => {
res.status(200).json({
success: true,
message: 'Authentication successful. You have accessed a protected endpoint.',
user: {
id: req.user._id,
fullName: req.user.fullName,
role: req.user.role,
},
});
});

// Test that an authenticated administrator is required.
router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
res.status(200).json({
success: true,
message: 'Administrator access granted.',
});
});

export default router;