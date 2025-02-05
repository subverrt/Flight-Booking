// routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const authMiddleware = require('../middleware/auth'); // Ensure this middleware exists

// @route   GET /api/flights/search
// @desc    Search for flights
router.get('/search', flightController.searchFlights);

// @route   POST /api/flights/:flightId/book
// @desc    Book a flight
router.post('/:flightId/book', authMiddleware, flightController.bookFlight);

module.exports = router;
