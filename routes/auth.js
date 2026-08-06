const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Using bcrypt for safer password comparison in future

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

        // If password is correct, create payload for JWT
        const payload = {
            user: {
                // In a multi-user system, you'd have user id here
                id: 'dashboard_user' 
            }
        };

        // Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // Token expires in 5 hours
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
