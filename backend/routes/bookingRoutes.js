// backend/routes/bookingRoutes.js
console.log('Booking routes file loaded.');
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

router.get('/test', (req, res) => {
  res.status(200).send('Booking routes are working!');
});

router.post('/create', authMiddleware, bookingController.createBooking);
router.post('/verify', authMiddleware, bookingController.verifyPayment);
router.get('/:bookingId', authMiddleware, bookingController.getBookingDetails);
router.delete('/cancel/:bookingId', authMiddleware, bookingController.cancelBooking);

module.exports = router;
