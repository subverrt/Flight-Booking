// FlightController.js

// Import necessary modules
const Flight = require('../models/Flight');
const Amadeus = require('amadeus'); // Import the Amadeus SDK
const util = require('util');

// Initialize the Amadeus API client
const amadeusClient = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

// Search Flights
const searchFlights = async (req, res) => {
  try {
    let { origin, destination, departureDate, travelClass, passengers } = req.query;
    
    // Trim input values to remove extra spaces
    origin = origin ? origin.trim() : '';
    destination = destination ? destination.trim() : '';
    departureDate = departureDate ? departureDate.trim() : '';
    
    // Convert travelClass to uppercase and trim it to match the allowed enumeration (e.g., ECONOMY)
    const formattedTravelClass = travelClass ? travelClass.trim().toUpperCase() : undefined;
    
    // Use the Amadeus API client with the correct endpoint and parameters
    const response = await amadeusClient.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: passengers,
      travelClass: formattedTravelClass,
      currencyCode: 'INR'
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
    
    // Format the flight data as needed
    const formattedFlights = flightsData.map(flight => ({
      id: flight.id,
      airline: flight.validatingAirlineCodes[0],
      flightNumber: flight.itineraries[0].segments[0].number,
      departureAirport: flight.itineraries[0].segments[0].departure.iataCode,
      arrivalAirport: flight.itineraries[0].segments[0].arrival.iataCode,
      departureTime: flight.itineraries[0].segments[0].departure.at,
      arrivalTime: flight.itineraries[0].segments[0].arrival.at,
      duration: flight.itineraries[0].duration,
      price: flight.price.total,
      currency: flight.price.currency,
      class: formattedTravelClass || 'N/A'  // <-- added this line
    }));
    
    
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
    if (!/^[a-fA-F0-9]{24}$/.test(flightId)) {
      return res.status(400).json({ message: 'Invalid flight ID format' });
    }
    const flight = await Flight.findById(flightId);
    if (!flight) {
      console.warn(`Flight with ID ${flightId} not found. Returning dummy seat data.`);
      return res.status(200).json({
        seats: [
          { seatNumber: "1A", isBooked: false },
          { seatNumber: "1B", isBooked: true },
          { seatNumber: "1C", isBooked: false },
          { seatNumber: "2A", isBooked: false },
          { seatNumber: "2B", isBooked: true },
          { seatNumber: "2C", isBooked: false },
        ],
      });
    }
    res.status(200).json({ seats: flight.seats || [] });
  } catch (error) {
    console.error('Error fetching seat map:', error.message);
    res.status(500).json({ message: 'Error fetching seat map' });
  }
};

// Get flight details by ID.
const getFlightById = async (req, res) => {
  try {
    const { flightId } = req.params;
    if (!/^[a-fA-F0-9]{24}$/.test(flightId)) {
      return res.status(400).json({ message: 'Invalid flight ID format' });
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
    const { userId, seatNumber } = req.body;
    if (!userId || !seatNumber) {
      return res.status(400).json({ message: 'User ID and seat number are required.' });
    }
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found.' });
    }
    if (flight.bookedSeats && flight.bookedSeats.includes(seatNumber)) {
      return res.status(400).json({ message: 'Seat already booked.' });
    }
    if (!flight.bookedSeats) {
      flight.bookedSeats = [];
    }
    flight.bookedSeats.push(seatNumber);
    await flight.save();
    res.status(200).json({ message: 'Flight booked successfully.', flight });
  } catch (error) {
    console.error('Error booking flight:', error);
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
