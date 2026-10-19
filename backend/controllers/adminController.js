import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

// GET /api/admin/dashboard
// Return basic statistics for the admin dashboard.
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      students,
      landlords,
      administrators,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'landlord' }),
      User.countDocuments({ role: 'admin' }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        students,
        landlords,
        administrators,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
// Return registered users without exposing password hashes.
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select(
        'fullName email phone university yearOfStudy role isVerifiedStudent isActive authProvider createdAt'
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/status
// Activate or deactivate a user account.
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be true or false.',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent an administrator from disabling their own account.
    if (
      user._id.toString() === req.user._id.toString() &&
      isActive === false
    ) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account.',
      });
    }

    const previousStatus = user.isActive;

user.isActive = isActive;
await user.save();

// Record the administrative action
await AuditLog.create({
  actor: req.user._id,
  action: isActive
    ? 'USER_ACTIVATED'
    : 'USER_DEACTIVATED',
  targetUser: user._id,
  details: {
    previousStatus,
    newStatus: isActive,
    targetEmail: user.email,
  },
  ipAddress: req.ip,
  userAgent: req.get('user-agent') || null,
});

    return res.status(200).json({
      success: true,
      message: isActive
        ? 'User account activated successfully.'
        : 'User account deactivated successfully.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/role
// Change a user's role.
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['student', 'landlord', 'admin'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be student, landlord, or admin.',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent an administrator from accidentally changing their own role.
    if (
      user._id.toString() === req.user._id.toString() &&
      role !== 'admin'
    ) {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove your own administrator role.',
      });
    }

    const previousRole = user.role;

user.role = role;
await user.save();

// Record the administrative action
await AuditLog.create({
  actor: req.user._id,
  action: 'USER_ROLE_CHANGED',
  targetUser: user._id,
  details: {
    previousRole,
    newRole: role,
    targetEmail: user.email,
  },
  ipAddress: req.ip,
  userAgent: req.get('user-agent') || null,
});

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/audit-logs
// Retrieve administrative audit records.
export const getAuditLogs = async (req, res, next) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const requestedPage = Number.parseInt(req.query.page, 10);

    const limit = Number.isNaN(requestedLimit)
      ? 20
      : Math.min(Math.max(requestedLimit, 1), 100);

    const page = Number.isNaN(requestedPage)
      ? 1
      : Math.max(requestedPage, 1);

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find()
        .populate('actor', 'fullName email role')
        .populate('targetUser', 'fullName email role')
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      AuditLog.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      logs,
    });
  } catch (error) {
    next(error);
  }
};