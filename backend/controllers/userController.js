const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/userController.js

// ... existing code ...

// Function to get a user's bookings
exports.getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const flights = await Flight.find({ 'bookings.user': userId });

    // Filter and format bookings
    const bookings = flights.map(flight => {
      const bookingDetails = flight.bookings.find(booking => booking.user.toString() === userId);
      return {
        flight: {
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          departureAirport: flight.departureAirport,
          arrivalAirport: flight.arrivalAirport,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
        },
        seats: bookingDetails.seats,
        bookingDate: bookingDetails.bookingDate,
      };
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error.message);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
};
