// backend/models/Flight.js
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: String,
  flightNumber: String,
  departureAirport: String,
  arrivalAirport: String,
  departureTime: Date,
  arrivalTime: Date,
  duration: String,
  price: Number,
  currency: String,
  class: String,
  seats: { type: Array, default: [] },        // For seat map data (array of seat objects)
  bookedSeats: { type: [String], default: [] }  // For tracking booked seat numbers
});

module.exports = mongoose.model('Flight', flightSchema);
