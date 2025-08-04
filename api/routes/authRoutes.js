const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route working' });
});

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;

