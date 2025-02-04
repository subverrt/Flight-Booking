const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    console.log("Received signup request:", req.body); // Debugging log

    try {
        const { name, email, password } = req.body;

        // Check if required fields are missing
        if (!name || !email || !password) {
            console.log("Missing fields:", { name, email, password }); // Debugging log
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, userId: user._id, message: "Signup successful" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Authentication Routes
router.post('/signup', authController.signup);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);

// User Profile Routes
router.get('/me', authController.verifyToken, userController.getUserProfile);
router.put('/update', authController.verifyToken, userController.updateProfile);
router.delete('/delete', authController.verifyToken, userController.deleteAccount);
router.post('/test', (req, res) => {
    res.json({ message: 'Auth API POST request is working!' });
});



module.exports = router;