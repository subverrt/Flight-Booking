// FlightResults.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './FlightResults.css';

const FlightResults = ({ flights, travelClass }) => {
  const navigate = useNavigate();

  const handleBookFlight = (flight) => {
    const token = localStorage.getItem('token');
    console.log('Token obtained from localStorage:', token);

    if (!token) {
      toast.error('Please log in to book a flight.');
      return;
    }

    // Navigate to the booking form and pass the flight details and travel class via state
    navigate('/booking-form', { state: { flight, travelClass } });
  };

  return (
    <div className="flight-results container">
      <h2>Available Flights</h2>
      {flights.length === 0 ? (
        <p>No flights found for the selected criteria.</p>
      ) : (
        <div className="flight-list">
          {flights.map((flight) => (
            <div className="flight-card" key={flight.id}>
              <h3>
                {flight.airline} - {flight.flightNumber}
              </h3>
              <p>
                <strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()} -{' '}
                {flight.departureAirport}
              </p>
              <p>
                <strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()} -{' '}
                {flight.arrivalAirport}
              </p>
              <p>
                <strong>Duration:</strong> {flight.duration}
              </p>
              <p>
                <strong>Class:</strong> {flight.class.replace('_', ' ')}
              </p>
              <p>
                <strong>Price:</strong> {flight.currency} {flight.price}
              </p>
              <button className="btn" onClick={() => handleBookFlight(flight)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightResults;
