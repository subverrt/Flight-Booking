// backend/models/Booking.js
const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: String,
  class: String,
  price: Number,
  status: { type: String, enum: ['available', 'booked'], default: 'available' }
});

const passengerSchema = new mongoose.Schema({
  name: String,
  age: String,
  passport: String,
  seat: seatSchema
});

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flight: {
    type: new mongoose.Schema({
      airline: String,
      flightNumber: String,
      departureAirport: String,
      arrivalAirport: String,
      departureTime: Date,
      arrivalTime: Date,
      price: Number,
      currency: String
    }, { _id: false }),
    required: true
  },
  seats: { type: [String], default: [] },     // selected seat numbers
  passengers: [passengerSchema],
  totalAmount: { type: Number, required: true },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending"
  },
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
