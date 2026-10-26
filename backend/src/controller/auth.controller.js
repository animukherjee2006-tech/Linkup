
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../db/redis');
const sendOTPEmail = require('../config/emailservice');

const OTP_TTL = 300;
const JWT_TTL = '7d';
const JWT_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: JWT_COOKIE_MAX_AGE,
    path: '/'
};

// REGISTER - STEP 1: SEND OTP
const register = async (req, res) => {
    try {
        let {
            username,
            firstname,
            lastname,
            phone,
            email,
            password
        } = req.body;

        username = username?.trim();
        firstname = firstname?.trim();
        lastname = lastname?.trim();
        phone = phone?.trim();
        email = email?.trim().toLowerCase();

        if (
            !username ||
            !firstname ||
            !lastname ||
            !phone ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                message: 'Please enter a valid email address'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long'
            });
        }

        // Check for an existing account
        const existingUser = await User.findOne({
            $or: [
                { username },
                { email },
                { phone }
            ]
        });

        if (existingUser) {
            let field = 'User';

            if (existingUser.email === email) {
                field = 'Email';
            } else if (existingUser.username === username) {
                field = 'Username';
            } else if (existingUser.phone === phone) {
                field = 'Phone number';
            }

            return res.status(409).json({
                message: `${field} is already registered`
            });
        }

        // Create OTP and hash password
        const otp = String(
            Math.floor(100000 + Math.random() * 900000)
        );

        const hashedPassword = await bcrypt.hash(password, 10);

        const pendingUser = {
            username,
            firstname,
            lastname,
            phone,
            email,
            password: hashedPassword
        };

        // Store pending registration in Redis
        const userKey = `user-data:${email}`;
        const otpKey = `otp:${email}`;

        await redisClient.setEx(
            userKey,
            OTP_TTL,
            JSON.stringify(pendingUser)
        );

        await redisClient.setEx(
            otpKey,
            OTP_TTL,
            otp
        );

        try {
            await sendOTPEmail(email, username, otp);
        } catch (emailError) {
            await redisClient.del([otpKey, userKey]);

            console.error('OTP email error:', emailError);

            return res.status(500).json({
                message: 'Unable to send OTP email. Please try again.'
            });
        }

        return res.status(200).json({
            message: 'OTP sent to your email. Please verify within 5 minutes.'
        });

    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            message: 'Something went wrong during registration'
        });
    }
};


// REGISTER - STEP 2: VERIFY OTP
const verifyOTP = async (req, res) => {
    try {
        // Accept both field names for compatibility
        const email = (
            req.body.email || req.body.Email || ''
        ).trim().toLowerCase();

        const { otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            });
        }

        if (!/^\d{6}$/.test(String(otp))) {
            return res.status(400).json({
                message: 'Please enter a valid 6-digit OTP'
            });
        }

        const otpKey = `otp:${email}`;
        const userKey = `user-data:${email}`;

        const [cachedOtp, cachedUserData] = await Promise.all([
            redisClient.get(otpKey),
            redisClient.get(userKey)
        ]);

        if (!cachedOtp || !cachedUserData) {
            return res.status(400).json({
                message: 'OTP expired or registration session not found. Please register again.'
            });
        }

        if (cachedOtp !== String(otp)) {
            return res.status(400).json({
                message: 'Incorrect OTP'
            });
        }

        const pendingUser = JSON.parse(cachedUserData);

        // Recheck unique fields to prevent duplicate accounts
        const existingUser = await User.findOne({
            $or: [
                { username: pendingUser.username },
                { email },
                { phone: pendingUser.phone }
            ]
        });

        if (existingUser) {
            await redisClient.del([otpKey, userKey]);

            return res.status(409).json({
                message: 'An account with this email, username, or phone number already exists. Please log in.'
            });
        }

        // Create and save the verified account
        const newUser = new User({
            username: pendingUser.username,
            firstname: pendingUser.firstname,
            lastname: pendingUser.lastname,
            phone: pendingUser.phone,
            email: pendingUser.email,
            password: pendingUser.password,
            isverified: true
        });

        await newUser.save();

        // Delete temporary registration data after successful save
        await redisClient.del([otpKey, userKey]);

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECREAT,
            { expiresIn: JWT_TTL }
        );

        res.cookie('token', token, cookieOptions);

        return res.status(201).json({
            message: 'Registration successful',
            token
        });

    } catch (error) {
        console.error('OTP verification error:', error);

        // Duplicate-key protection for concurrent registration requests
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email, username, or phone number is already registered'
            });
        }

        return res.status(500).json({
            message: 'Something went wrong during OTP verification'
        });
    }
};


// LOGIN
const loginuser = async (req, res) => {
    try {
        const identifier = (
            req.body.email ||
            req.body.username ||
            req.body.phone ||
            ''
        ).trim();

        const { password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                message: 'Email/username/phone and password are required'
            });
        }

        const normalizedIdentifier = identifier.toLowerCase();

        const existingUser = await User.findOne({
            $or: [
                { email: normalizedIdentifier },
                { username: identifier },
                { phone: identifier }
            ]
        });

        if (!existingUser) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        if (existingUser.isverified !== true) {
            return res.status(403).json({
                message: 'Please verify your email before logging in'
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECREAT,
            { expiresIn: JWT_TTL }
        );

        res.cookie('token', token, cookieOptions);

        return res.status(200).json({
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            message: 'Something went wrong during login'
        });
    }
};


// LOGOUT
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });

        return res.status(200).json({
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);

        return res.status(500).json({
            message: 'Something went wrong during logout'
        });
    }
};

module.exports = {
    register,
    loginuser,
    logout,
    verifyOTP
};
