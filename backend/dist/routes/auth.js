"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const auth_2 = require("../validation/auth");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
exports.authRoutes = router;
router.post('/register', (0, validation_1.validateRequest)(auth_2.authValidation.register), async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = new User_1.User({
            email,
            name,
            passwordHash: password,
            roles: ['user']
        });
        await user.save();
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                roles: user.roles,
                profile: user.profile,
                subscription: user.subscription,
                preferences: user.preferences
            },
            accessToken,
            refreshToken
        });
        logger_1.logger.info(`User registered: ${email}`);
    }
    catch (error) {
        logger_1.logger.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/login', (0, validation_1.validateRequest)(auth_2.authValidation.login), async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email }).select('+passwordHash');
        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                roles: user.roles,
                profile: user.profile,
                subscription: user.subscription,
                preferences: user.preferences
            },
            accessToken,
            refreshToken
        });
        logger_1.logger.info(`User logged in: ${email}`);
    }
    catch (error) {
        logger_1.logger.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    }
    catch (error) {
        logger_1.logger.error('Token refresh error:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            profile: user.profile,
            subscription: user.subscription,
            preferences: user.preferences
        });
    }
    catch (error) {
        logger_1.logger.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/profile', auth_1.authMiddleware, async (req, res) => {
    try {
        const { name, profile, preferences } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user.userId, {
            ...(name && { name }),
            ...(profile && { profile: { ...profile } }),
            ...(preferences && { preferences: { ...preferences } })
        }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            profile: user.profile,
            subscription: user.subscription,
            preferences: user.preferences
        });
    }
    catch (error) {
        logger_1.logger.error('Profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/logout', auth_1.authMiddleware, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});
//# sourceMappingURL=auth.js.map