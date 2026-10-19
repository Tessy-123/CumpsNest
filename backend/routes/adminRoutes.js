import express from 'express';

import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getAuditLogs,
} from '../controllers/adminController.js';

import {
  protect,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Every route below requires an authenticated administrator.
router.use(protect, authorizeRoles('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', getDashboardStats);

// GET /api/admin/users
router.get('/users', getAllUsers);

router.get('/audit-logs', getAuditLogs);

// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', updateUserStatus);

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', updateUserRole);

export default router;