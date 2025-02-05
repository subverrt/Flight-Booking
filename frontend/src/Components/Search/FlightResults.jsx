import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './FlightResults.css';

const FlightResults = ({ flights }) => {
  const navigate = useNavigate();

  const handleBookFlight = async (flightId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please log in to book a flight.');
      return;
    }

    const seatsToBook = prompt('Enter number of seats to book:', '1');
    const seats = parseInt(seatsToBook);

    if (!seats || isNaN(seats) || seats <= 0) {
      toast.error('Invalid number of seats.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/flights/${flightId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ seats }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/booking-confirmation', { state: { bookingDetails: data } });
        toast.success('Flight booked successfully!');
      } else {
        toast.error(data.message || 'Error booking flight');
      }
    } catch (error) {
      console.error('Error booking flight:', error);
      toast.error('An error occurred while booking the flight.');
    }
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
              <h3>{flight.airline} - {flight.flightNumber}</h3>
              <p>
                <strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()} - {flight.departureAirport}
              </p>
              <p>
                <strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()} - {flight.arrivalAirport}
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
              <button className="btn" onClick={() => handleBookFlight(flight.id)}>
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
