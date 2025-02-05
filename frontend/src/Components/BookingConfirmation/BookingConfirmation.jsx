import React from 'react';
import { useLocation } from 'react-router-dom';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const { bookingDetails } = location.state || {};

  if (!bookingDetails) {
    return <p>No booking information available.</p>;
  }

  const { flightId, seats, userId } = bookingDetails;

  return (
    <div className="booking-confirmation container">
      <h2>Booking Confirmation</h2>
      <p><strong>Flight ID:</strong> {flightId}</p>
      <p><strong>Seats Booked:</strong> {seats}</p>
      <p>Your booking has been confirmed. Thank you for choosing our service!</p>
    </div>
  );
};

export default BookingConfirmation;
