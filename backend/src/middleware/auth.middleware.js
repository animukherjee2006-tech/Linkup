const jwt = require('jsonwebtoken');
const users = require('../models/user.model');

const authmiddleware = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        // Cookie nahi hai to Authorization header se token lo
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;

            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECREAT
        );

        const user = await users
            .findById(decoded.id || decoded._id)
            .select('-password');

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