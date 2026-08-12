const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const getPasswordVersion = () => {
    const password = process.env.DASHBOARD_LOGIN_PASSWORD || '';
    const secret = process.env.JWT_SECRET || '';

    return crypto
        .createHmac('sha256', secret)
        .update(password)
        .digest('hex');
};

const buildDashboardPayload = () => ({
    user: {
        id: 'dashboard_user',
    },
    passwordVersion: getPasswordVersion(),
});

const signDashboardToken = (callback) => {
    jwt.sign(
        buildDashboardPayload(),
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        callback
    );
};

module.exports = {
    getPasswordVersion,
    signDashboardToken,
};
