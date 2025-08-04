const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecret';

exports.register = async (req, res) => {
    try {
        console.log('Registration attempt with data:', {
            ...req.body,
            password: '***hidden***'
        });

        const { username, email, password, role } = req.body;

        // Validate input
        if (!username || !email || !password) {
            console.log('Registration failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            console.log('Registration failed: User already exists');
            return res.status(400).json({ 
                error: 'User with this email or username already exists' 
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            role: role || 'user'
        });

        await user.save();
        console.log('User registered successfully:', { email, username });

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
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
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
