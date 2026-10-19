import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    // Administrator who performed the action
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Type of administrative action
    action: {
      type: String,
      required: true,
      enum: [
        'USER_ACTIVATED',
        'USER_DEACTIVATED',
        'USER_ROLE_CHANGED',
      ],
      index: true,
    },

    // User account affected by the action
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Additional information about the action
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Request information useful for security reviews
    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;