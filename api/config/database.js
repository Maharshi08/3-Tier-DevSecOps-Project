const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        // If already connected, return existing connection
        if (mongoose.connection.readyState === 1) {
            console.log('Using existing MongoDB connection');
            return mongoose.connection;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Increased timeout for serverless environment
            socketTimeoutMS: 60000, // Increased socket timeout
            family: 4 // Use IPv4
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection errors
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Enable debug mode for development
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', {
            message: error.message,
            code: error.code,
            name: error.name
        });
        throw error;
    }
};

module.exports = connectDB;
