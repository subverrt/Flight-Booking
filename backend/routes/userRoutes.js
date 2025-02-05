// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/users/bookings
// @desc    Get user's bookings
router.get('/bookings', authMiddleware, userController.getUserBookings);

module.exports = router;
