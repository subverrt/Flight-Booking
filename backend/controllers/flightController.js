// backend/controllers/flightController.js

// Import necessary modules
const Flight = require('../models/Flight');
const Amadeus = require('amadeus');
const mongoose = require('mongoose');
const util = require('util');
const { generateSeatMap } = require('../utils/seatMapGenerator');

// Initialize the Amadeus API client
const amadeusClient = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// Function to format ISO 8601 duration to a readable format
function formatDuration(isoDuration) {
  if (!isoDuration) return 'N/A';

  // RegEx pattern to parse ISO 8601 duration
  const pattern = /P(?:T)?(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = isoDuration.match(pattern);

  if (!matches) return isoDuration;

  const hours = matches[1] ? `${matches[1]}h` : '';
  const minutes = matches[2] ? ` ${matches[2]}m` : '';

  return (hours + minutes).trim();
}

// Search Flights
const searchFlights = async (req, res) => {
  try {
    let { origin, destination, departureDate, travelClass, passengers } = req.query;

    // Trim input values to remove extra spaces
    origin = origin ? origin.trim() : '';
    destination = destination ? destination.trim() : '';
    departureDate = departureDate ? departureDate.trim() : '';

    // Convert travelClass to uppercase
    const formattedTravelClass = travelClass ? travelClass.trim().toUpperCase() : undefined;

    // Use the Amadeus API client to search for flights
    const response = await amadeusClient.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: passengers,
      travelClass: formattedTravelClass,
      currencyCode: 'INR',
    });

    // Check for the expected data structure
    const flightsData = response.data.data || response.data;
    if (!flightsData || !Array.isArray(flightsData)) {
      console.error(
        'Unexpected response format:',
        util.inspect(response.data, { depth: null })
      );
      return res.status(500).json({ message: 'Unexpected response format from Amadeus API' });
    }

    // Format the flight data
    const formattedFlights = flightsData.map((flight) => {
      const segment = flight.itineraries[0]?.segments[0];
      const duration = flight.itineraries[0]?.duration;

      return {
        id: flight.id,
        airline: flight.validatingAirlineCodes[0],
        flightNumber: segment?.number || 'N/A',
        departureAirport: segment?.departure?.iataCode || 'N/A',
        arrivalAirport: segment?.arrival?.iataCode || 'N/A',
        departureTime: segment?.departure?.at || 'N/A',
        arrivalTime: segment?.arrival?.at || 'N/A',
        duration: formatDuration(duration),
        price: flight.price.total,
        currency: flight.price.currency,
        class: formattedTravelClass || 'N/A',
        aircraftType: segment?.aircraft?.code || 'A320', // Added aircraftType with default 'A320'
      };
    });

    res.status(200).json({ flights: formattedFlights });
  } catch (error) {
    // Log full error details for debugging
    console.error('Amadeus API Error:', util.inspect(error, { showHidden: true, depth: null }));
    res.status(500).json({ message: 'Error searching flights' });
  }
};

// Get Seat Map
const getSeatMap = async (req, res) => {
  try {
    const { flightId } = req.params;

    // Validate flight ID
    if (!flightId) {
      return res.status(400).json({ message: 'Flight ID is required' });
    }

    let flightDoc = await Flight.findById(flightId);

    // Generate seat map based on aircraft type
    const aircraftType = flightDoc ? flightDoc.aircraftType || 'A320' : 'A320';
    let seatMap = generateSeatMap(aircraftType);

    // Mark already booked seats
    if (flightDoc && flightDoc.bookedSeats && flightDoc.bookedSeats.length > 0) {
      seatMap = seatMap.map((seat) => {
        if (flightDoc.bookedSeats.includes(seat.seatNumber)) {
          return { ...seat, isBooked: true };
        }
        return seat;
      });
    }

    res.status(200).json({ seats: seatMap });
  } catch (error) {
    console.error('Error fetching seat map:', error.message);
    res.status(500).json({ message: 'Error fetching seat map' });
  }
};

// Get flight details by ID
const getFlightById = async (req, res) => {
  try {
    const { flightId } = req.params;

    // Validate flight ID
    if (!flightId) {
      return res.status(400).json({ message: 'Flight ID is required' });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.status(200).json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    res.status(500).json({ message: 'Error fetching flight' });
  }
};

// Book Flight
const bookFlight = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { userId, seatNumbers, passengers, totalAmount } = req.body;

    if (!userId || !seatNumbers || seatNumbers.length === 0 || !passengers || !totalAmount) {
      return res.status(400).json({ message: 'Missing required booking details.' });
    }

    // Fetch or create the Flight document
    let flightDoc = await Flight.findById(flightId);
    if (!flightDoc) {
      return res.status(404).json({ message: 'Flight not found.' });
    }

    // Generate seat map
    const seatMap = generateSeatMap(flightDoc.aircraftType || 'A320');

    // Validate selected seats
    const bookedClass = flightDoc.class; // The class user has booked
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
        message: `The following seats are not available for the booked class (${bookedClass}): ${invalidSeats.join(', ')}`,
      });
    }

    if (alreadyBookedSeats.length > 0) {
      return res.status(400).json({
        message: `The following seats are already booked: ${alreadyBookedSeats.join(', ')}`,
      });
    }

    // Add seats to bookedSeats
    flightDoc.bookedSeats.push(...seatNumbers);
    await flightDoc.save();

    // Create booking record (assumed to be handled elsewhere, e.g., in bookingController)

    res.status(200).json({ message: 'Seats booked successfully.', flight: flightDoc });
  } catch (error) {
    console.error('Error booking flight:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Export all functions
module.exports = {
  searchFlights,
  getSeatMap,
  getFlightById,
  bookFlight,
};
