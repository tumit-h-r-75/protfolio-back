const jwt = require('jsonwebtoken');
const { getPasswordVersion } = require('../utils/authToken');

function authMiddleware(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.passwordVersion !== getPasswordVersion()) {
            return res.status(401).json({ msg: 'Password changed. Please login again.' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = authMiddleware;
