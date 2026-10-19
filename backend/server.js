import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Allow communication with the frontend
app.use(
cors({
origin: process.env.FRONTEND_URL || 'http://localhost:3000',
})
);

// Parse JSON requests
app.use(express.json({ limit: '1mb' }));

// Authentication endpoints
app.use('/api/auth', authRoutes);

// Temporary routes for authentication and authorization testing
app.use('/api/test', testRoutes);

app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
res.status(200).json({
success: true,
message: 'CampusNest backend is running',
timestamp: new Date().toISOString(),
});
});

// Handle unknown endpoints
app.use((req, res) => {
res.status(404).json({
success: false,
message: 'API endpoint not found',
});
});

// Centralized error handling
app.use((err, req, res, next) => {
console.error(err);

res.status(500).json({
success: false,
message: 'Internal server error',
});
});

// Connect to MongoDB before starting the server
const startServer = async () => {
try {
await connectDB();

app.listen(PORT, () => {
  console.log(`CampusNest backend running on port ${PORT}`);
});

} catch (error) {
console.error('Failed to start CampusNest backend:', error.message);
process.exit(1);
}
};

startServer();