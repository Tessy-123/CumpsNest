import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const promoteAdmin = async () => {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    console.error(
      'Please provide the registered email address of the user.'
    );

    console.error(
      'Example: node scripts/promoteAdmin.js admin@example.com'
    );

    process.exitCode = 1;
    return;
  }

  try {
    // Connect to the CampusNest database
    await connectDB();

    // Find the existing account
    const user = await User.findOne({ email });

    if (!user) {
      console.error(
        `No registered account was found for ${email}.`
      );

      console.error(
        'Register the account through CampusNest first, then try again.'
      );

      process.exitCode = 1;
      return;
    }

    // Promote the account to administrator
    user.role = 'admin';

    await user.save();

    console.log('\nAdministrator account created successfully!');
    console.log('---------------------------------------------');
    console.log(`Name: ${user.fullName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log('---------------------------------------------');
    console.log('You can now log in using this account.');
  } catch (error) {
    console.error('Failed to promote user:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

promoteAdmin();