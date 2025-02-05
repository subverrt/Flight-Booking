// src/Components/Bookings/Bookings.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/users/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setBookings(data.bookings);
        } else {
          console.error('Error fetching bookings:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="bookings container">
      <h2>Your Bookings</h2>
      {bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <div key={index} className="booking-card">
            <h3>{booking.flight.airline} - {booking.flight.flightNumber}</h3>
            <p><strong>From:</strong> {booking.flight.departureAirport}</p>
            <p><strong>To:</strong> {booking.flight.arrivalAirport}</p>
            <p><strong>Departure:</strong> {new Date(booking.flight.departureTime).toLocaleString()}</p>
            <p><strong>Seats Booked:</strong> {booking.seats}</p>
            <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>You have no bookings.</p>
      )}
    </div>
  );
};

export default Bookings;
