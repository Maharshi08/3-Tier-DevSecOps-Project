require('dotenv').config();
const connectDB = require('./config/database');

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Using URI:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs
        
        await connectDB();
        console.log('✅ MongoDB connection test successful!');
        
        // Exit successfully
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection test failed!');
        console.error('Error details:', error.message);
        // Exit with error
        process.exit(1);
    }
}

testConnection();
