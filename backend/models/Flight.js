// backend/models/Flight.js

const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  _id: String, // Use String to accommodate non-ObjectId IDs from Amadeus
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
  aircraftType: String,
  bookedSeats: { type: [String], default: [] }, // Array to store booked seat numbers
});

module.exports = mongoose.model('Flight', flightSchema);
