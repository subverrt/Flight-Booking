// controllers/flightController.js

const axios = require('axios');
const { amadeusApiKey, amadeusApiSecret } = require('../config/apiKeys');

// Function to obtain access token from Amadeus API
const getAmadeusAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: amadeusApiKey,
        client_secret: amadeusApiSecret,
      })
    );

    const accessToken = response.data.access_token;
    console.log('Amadeus Access Token:', accessToken); // Optional: Remove or comment out in production
    return accessToken;
  } catch (error) {
    console.error('Error fetching Amadeus access token:', error.response?.data || error.message);
    throw new Error('Error fetching Amadeus access token');
  }
};

// Controller function to search flights
exports.searchFlights = async (req, res) => {
  const { origin, destination, departureDate, travelClass, passengers } = req.query;

  try {
    // Validate passengers
    const passengerCount = parseInt(passengers);
    if (isNaN(passengerCount) || passengerCount <= 0) {
      return res.status(400).json({ message: 'Invalid passenger count. Please provide a positive number.' });
    }

    // Validate travelClass
    const travelClassInput = travelClass.toUpperCase();
    const validTravelClasses = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'];
    if (!validTravelClasses.includes(travelClassInput)) {
      return res.status(400).json({ message: 'Invalid travel class. Please choose from ECONOMY, PREMIUM_ECONOMY, BUSINESS, or FIRST.' });
    }

    // Validate departureDate
    if (!departureDate || !/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
      return res.status(400).json({ message: 'Invalid departure date. Please provide a date in YYYY-MM-DD format.' });
    }

    // Validate origin and destination
    if (!origin || origin.length !== 3 || !destination || destination.length !== 3) {
      return res.status(400).json({ message: 'Invalid origin or destination. Please provide valid IATA codes.' });
    }

    const accessToken = await getAmadeusAccessToken();

    const apiUrl = 'https://test.api.amadeus.com/v2/shopping/flight-offers';

    const params = {
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate,
      adults: passengerCount,
      travelClass: travelClassInput,
      currencyCode: 'INR',
      max: 10,
    };

    console.log('Amadeus API Request Params:', params); // Optional: Remove or comment out in production

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });

    // Check if data exists
    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.status(404).json({ message: 'No flights found for the given criteria.' });
    }

    // Process the response data
    const flights = response.data.data.map((offer) => {
      const itinerary = offer.itineraries[0];
      const segment = itinerary.segments[0];

      return {
        id: offer.id,
        airline: segment.carrierCode,
        flightNumber: segment.number,
        departureAirport: segment.departure.iataCode,
        arrivalAirport: segment.arrival.iataCode,
        departureTime: segment.departure.at,
        arrivalTime: segment.arrival.at,
        duration: segment.duration,
        price: offer.price.total,
        currency: offer.price.currency,
        class: travelClassInput,
        seatsAvailable: offer.numberOfBookableSeats,
      };
    });

    res.status(200).json({ flights });
  } catch (error) {
    console.error('Error fetching flights:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching flights' });
  }
};

// Controller function to book flights (simulated)
exports.bookFlight = async (req, res) => {
  const { flightId } = req.params;
  const { seats } = req.body;
  const userId = req.user.id; // Requires authentication

  try {
    // Simulate booking logic
    // In a real application, you would interact with your database and possibly the Amadeus API

    // For now, we'll just return a success message
    res.status(200).json({
      message: 'Flight booked successfully',
      bookingDetails: {
        flightId,
        seats,
        userId,
      },
    });
  } catch (error) {
    console.error('Error booking flight:', error.message);
    res.status(500).json({ message: 'Error booking flight' });
  }
};
