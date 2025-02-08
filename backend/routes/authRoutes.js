// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Authentication Routes
router.post('/signup', authController.signup);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);

// User Profile Routes
router.get('/me', authController.verifyToken, authController.getCurrentUser);
router.put('/update', authController.verifyToken, userController.updateProfile);
router.delete('/delete', authController.verifyToken, userController.deleteAccount);

// Test Route
router.post('/test', (req, res) => {
  res.json({ message: 'Auth API POST request is working!' });
});

module.exports = router;
