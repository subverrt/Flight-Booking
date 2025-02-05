// models/Flight.js
const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  id: String,
  airline: String,
  flightNumber: String,
  departureAirport: String,
  arrivalAirport: String,
  departureTime: Date,
  arrivalTime: Date,
  duration: String,
  price: String,
  currency: String,
  class: String, // ECONOMY, BUSINESS, FIRST
  seatsAvailable: Number,
  bookings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      seats: Number,
      bookingDate: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Flight', FlightSchema);
