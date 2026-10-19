import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';

// Validate Malawian phone numbers.
const phoneRegex = /^(?:\+265|0)(?:88|99|98|31|21)\d{7}$/;

// Normalize phone numbers so different formatting doesn't create
// separate accounts for the same number.
const normalizePhone = (phone) => {
  const cleaned = phone.replace(/[\s-]/g, '');

  if (cleaned.startsWith('+265')) {
    return cleaned;
  }

  if (cleaned.startsWith('0')) {
    return `+265${cleaned.substring(1)}`;
  }

  return cleaned;
};

// Public registration validation.
const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .refine(
      (value) => phoneRegex.test(value.replace(/[\s-]/g, '')),
      'Enter a valid Malawian phone number.'
    ),
  university: z.enum([
    'unima',
    'must',
    'kuhes',
    'mubas',
    'luanar',
    'mzuni',
    'dmi',
  ]),
  yearOfStudy: z
    .enum([
      '1st Year',
      '2nd Year',
      '3rd Year',
      '4th Year',
      'Postgraduate',
    ])
    .optional(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Za-z]/, 'Password must contain a letter.')
    .regex(/[0-9]/, 'Password must contain a number.'),
  confirmPassword: z.string().min(1),
  agreeTerms: z.literal(true),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  }
);

// Create a token for an authenticated user.
const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from environment variables.');
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Exclude sensitive fields from API responses.
const formatUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  university: user.university,
  yearOfStudy: user.yearOfStudy,
  role: user.role,
  isVerifiedStudent: user.isVerifiedStudent,
  avatar: user.avatar,
});

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Please check your registration details.',
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const {
      fullName,
      email,
      phone,
      university,
      yearOfStudy,
      password,
    } = validation.data;

    const normalizedPhone = normalizePhone(phone);

    // Check whether the email or phone number is already registered.
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone: normalizedPhone },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? 'An account with this email already exists.'
            : 'An account with this phone number already exists.',
      });
    }

    // Never store a plain-text password.
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName,
      email,
      phone: normalizedPhone,
      university,
      yearOfStudy: yearOfStudy || '1st Year',
      passwordHash,
      role: 'student',
      authProvider: 'local',
      isVerifiedStudent: false,
      termsAcceptedAt: new Date(),
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user: formatUser(user),
      token,
    });
  } catch (error) {
    // Handle duplicate email/phone indexes if two requests arrive together.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with these details already exists.',
      });
    }

    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (
      typeof identifier !== 'string' ||
      !identifier.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number and password are required.',
      });
    }

    const cleanIdentifier = identifier.trim();
    const isEmail = cleanIdentifier.includes('@');

    const lookup = isEmail
      ? { email: cleanIdentifier.toLowerCase() }
      : { phone: normalizePhone(cleanIdentifier) };

    const user = await User.findOne(lookup).select('+passwordHash');

    // Use a generic error so the API does not reveal which accounts exist.
    if (!user || user.authProvider !== 'local' || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone number or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been disabled.',
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone number or password.',
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: formatUser(user),
      token,
    });
  } catch (error) {
    next(error);
  }
};