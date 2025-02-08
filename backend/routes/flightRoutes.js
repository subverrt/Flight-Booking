// routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const authMiddleware = require('../middleware/auth');

router.get('/search', flightController.searchFlights);
router.get('/:flightId/seatmap', authMiddleware, flightController.getSeatMap);
router.post('/:flightId/book', authMiddleware, flightController.bookFlight);
router.get('/:flightId', flightController.getFlightById);

module.exports = router;
