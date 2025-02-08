// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new booking and initiate payment
const createBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { flight, selectedSeats, passengers } = req.body;

    let flightRecord = null;
    if (flight && flight.id && /^[0-9a-fA-F]{24}$/.test(flight.id)) {
      flightRecord = await Flight.findById(flight.id);
    }
    if (!flightRecord) {
      flightRecord = flight;
    }

    const seats = selectedSeats || [];
    const totalAmount = flightRecord.price * passengers.length;

    const options = {
      amount: totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    const booking = new Booking({
      user: userId,
      flight: flightRecord,
      seats: seats,
      passengers: passengers,
      totalAmount: totalAmount,
      razorpayOrderId: order.id,
      paymentStatus: 'pending',
      bookingStatus: 'pending'
    });

    await booking.save();

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// Verify payment (unchanged)
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        razorpayPaymentId,
        razorpaySignature,
        paymentStatus: 'success',
        bookingStatus: 'confirmed',
      },
      { new: true }
    ).populate('user');

    res.status(200).json({ message: 'Payment verified successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};

// Get booking details
const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    let booking = await Booking.findById(bookingId).populate('flight');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // If booking.flight is not populated correctly, load it from Flight model
    if (!booking.flight || typeof booking.flight === 'string') {
      const flightData = await Flight.findById(booking.flight);
      booking = booking.toObject();
      booking.flight = flightData;
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error.message);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
};

// Cancel booking: update bookingStatus to "cancelled"
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.userId;
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, user: userId },
      { bookingStatus: 'cancelled' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already cancelled' });
    }
    console.log('Cancelled booking:', booking);
    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

module.exports = {
  createBooking,
  verifyPayment,
  getBookingDetails,
  cancelBooking,
};
