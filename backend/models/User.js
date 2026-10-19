import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },

    university: {
      type: String,
      required: [true, 'University is required'],
      enum: ['unima', 'must', 'kuhes', 'mubas', 'luanar', 'mzuni', 'dmi'],
    },

    yearOfStudy: {
      type: String,
      enum: [
        '1st Year',
        '2nd Year',
        '3rd Year',
        '4th Year',
        'Postgraduate',
      ],
      default: '1st Year',
    },

    passwordHash: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
      select: false,
    },

    role: {
      type: String,
      enum: ['student', 'landlord', 'admin'],
      default: 'student',
      required: true,
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
      required: true,
    },

    isVerifiedStudent: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    termsAcceptedAt: {
      type: Date,
      required: true,
    },

    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;