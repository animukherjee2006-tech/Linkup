const jwt = require('jsonwebtoken');
const users = require('../models/user.model');

const authmiddleware = async (req, res, next) => {
    try {
        // Check cookie first, then fallback to Authorization header
        let token = req.cookies.token;
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECREAT);

       
        const user = await users.findById(decoded.id || decoded._id).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = authmiddleware;