// backend/controllers/bookingController.js

const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { generateSeatMap } = require('../utils/seatMapGenerator');
require('dotenv').config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new booking and initiate payment
const createBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { flight, seatNumbers, passengers, totalAmount } = req.body;

    // Log the request body for debugging
    console.log('Booking request body:', req.body);

    // Validate required fields
    if (!flight || !passengers || !seatNumbers || !totalAmount) {
      console.error('Missing required booking details.');
      return res.status(400).json({ message: 'Missing required booking details.' });
    }

    // Access the travel class
    const bookedClass = flight.travelClass;
    if (!bookedClass) {
      console.error('Flight travel class is missing.');
      return res.status(400).json({ message: 'Flight travel class is missing.' });
    }

    // Fetch or create the Flight document
    let flightDoc = await Flight.findById(flight.id);
    if (!flightDoc) {
      flightDoc = new Flight({
        _id: flight.id,
        ...flight,
        bookedSeats: [],
      });
      await flightDoc.save();
    }

    // Generate seat map
    const seatMap = generateSeatMap(flight.aircraftType || 'A320');

    // Validate selected seats
    const invalidSeats = [];
    const alreadyBookedSeats = [];

    for (const seatNumber of seatNumbers) {
      const seat = seatMap.find((s) => s.seatNumber === seatNumber);
      if (!seat) {
        invalidSeats.push(seatNumber);
      } else if (seat.class.toLowerCase() !== bookedClass.toLowerCase()) {
        invalidSeats.push(seatNumber);
      } else if (flightDoc.bookedSeats.includes(seatNumber)) {
        alreadyBookedSeats.push(seatNumber);
      }
    }

    if (invalidSeats.length > 0) {
      return res.status(400).json({
        message: `The following seats are not available for the booked class (${bookedClass}): ${invalidSeats.join(
          ', '
        )}`,
      });
    }

    if (alreadyBookedSeats.length > 0) {
      return res.status(400).json({
        message: `The following seats are already booked: ${alreadyBookedSeats.join(', ')}`,
      });
    }

    // Create a new Booking document with the provided flight details
    const booking = new Booking({
      user: userId,
      flight: flight,
      seats: seatNumbers,
      passengers: passengers,
      totalAmount: totalAmount,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
    });

    // Create a Razorpay order
    const options = {
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Save the order ID in the booking
    booking.razorpayOrderId = order.id;
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

// Verify payment and update seat availability
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

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    booking.razorpayPaymentId = razorpayPaymentId;
    booking.razorpaySignature = razorpaySignature;
    booking.paymentStatus = 'success';
    booking.bookingStatus = 'confirmed';
    await booking.save();

    // Update the Flight document to mark seats as booked
    let flightDoc = await Flight.findById(booking.flight.id);
    if (!flightDoc) {
      // Flight document should exist; if not, create it
      flightDoc = new Flight({
        _id: booking.flight.id,
        ...booking.flight,
        bookedSeats: [],
      });
      await flightDoc.save();
    }

    // Add booked seats
    flightDoc.bookedSeats.push(...booking.seats);
    await flightDoc.save();

    res.status(200).json({ message: 'Payment verified successfully', booking });
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};

// Get booking details
const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error.message);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
};

// Cancel booking and update seat availability
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

    // Update Flight document to unmark the seats
    const flightDoc = await Flight.findById(booking.flight.id);
    if (flightDoc) {
      flightDoc.bookedSeats = flightDoc.bookedSeats.filter(
        (seatNumber) => !booking.seats.includes(seatNumber)
      );
      await flightDoc.save();
    }

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error.message);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

module.exports = {
  createBooking,
  verifyPayment,
  getBookingDetails,
  cancelBooking,
};
