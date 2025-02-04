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
router.get('/me', authController.verifyToken, userController.getUserProfile);
router.put('/update', authController.verifyToken, userController.updateProfile);
router.delete('/delete', authController.verifyToken, userController.deleteAccount);

module.exports = router;