/**
 * Main Express Server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import applicationsRoutes from './routes/applications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'beast-backend-node',
        database: 'mongodb',
        timestamp: new Date().toISOString(),
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 The Beast Backend (Node.js) is running!`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`💚 MongoDB: Connected`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api`);
    console.log(`\n🎯 Ready to hunt jobs!\n`);
});

export default app;
