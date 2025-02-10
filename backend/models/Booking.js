// backend/models/Booking.js

const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
});

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flight: {
    id: String,
    airline: String,
    flightNumber: String,
    departureAirport: String,
    arrivalAirport: String,
    departureTime: String,
    arrivalTime: String,
    duration: String,
    price: Number,
    currency: String,
    class: String,
    aircraftType: String,
  },
  seats: { type: [String], default: [] }, // selected seat numbers
  passengers: [passengerSchema],
  totalAmount: { type: Number, required: true },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'pending',
  },
  bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
