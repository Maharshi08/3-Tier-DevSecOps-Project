const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecret';

exports.register = async (req, res) => {
    try {
        console.log('Registration request body:', req.body);

        const { username, email, password, role } = req.body;

        // Validate input
        if (!username || !email || !password) {
            console.log('Registration validation failed:', {
                hasUsername: !!username,
                hasEmail: !!email,
                hasPassword: !!password
            });
            return res.status(400).json({ 
                error: 'Missing required fields',
                details: {
                    username: !username ? 'Username is required' : null,
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email);
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            console.log('User already exists:', {
                existingEmail: existingUser.email === email,
                existingUsername: existingUser.username === username
            });
            return res.status(400).json({ 
                error: 'User already exists',
                details: {
                    email: existingUser.email === email ? 'Email already in use' : null,
                    username: existingUser.username === username ? 'Username already taken' : null
                }
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            role: role || 'user'
        });

        console.log('Attempting to save user:', {
            username,
            email,
            hasPassword: !!password,
            role: role || 'user'
        });

        await user.save();
        console.log('User saved successfully:', {
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            SECRET,
            { expiresIn: '24h' }
        );

        // Return success response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });

        if (error.code === 11000) {
            // Handle duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                error: 'Duplicate value',
                details: `${field} already exists`
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                details: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({ 
            error: 'Error registering user',
            details: error.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email); // Debug log

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No'); // Debug log
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check password
        const isValidPassword = await user.comparePassword(password);
        console.log('Password valid:', isValidPassword ? 'Yes' : 'No'); // Debug log

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            SECRET,
            { expiresIn: '24h' }
        );

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error); // Debug log
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};
