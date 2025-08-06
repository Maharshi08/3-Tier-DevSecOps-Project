const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Initialize MongoDB connection at startup
let isConnected = false;

const initializeMongoDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        await connectDB();
        isConnected = true;
        console.log('MongoDB connection established');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json());

// Ensure MongoDB connection before handling requests
app.use(async (req, res, next) => {
    try {
        await initializeMongoDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code
    });
    
    // Handle specific types of errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            error: 'Validation Error', 
            details: err.message 
        });
    }
    
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        return res.status(503).json({ 
            error: 'Database Error', 
            details: 'Database operation failed' 
        });
    }
    
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message
    });
});

// Export the app for serverless use
module.exports = app;
