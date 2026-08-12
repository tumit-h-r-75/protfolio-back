const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { signDashboardToken } = require('../utils/authToken');

// In a real app, you would have a User model, but for this case, we'll use the .env password
// const User = require('../models/User');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { password } = req.body;

    // Basic validation
    if (!password) {
        return res.status(400).json({ msg: 'Please enter a password' });
    }

    try {
        const correctPassword = process.env.DASHBOARD_LOGIN_PASSWORD;

        // In a simple setup, we compare plain text. 
        // For better security, you'd store a hashed password and use bcrypt.compare
        if (password !== correctPassword) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        signDashboardToken((err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/verify
// @desc    Verify dashboard token
// @access  Private
router.get('/verify', authMiddleware, (req, res) => {
    res.json({ valid: true });
});

module.exports = router;
