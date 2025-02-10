// BookingForm.jsx

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadRazorpay } from '../../utils/razorpay';
import SeatSelection from '../SeatSelection/SeatSelection';
import './BookingForm.css';

const BookingForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Ensure flight details and travelClass exist
  if (!state || !state.flight || !state.travelClass) {
    return (
      <div className="error-message">
        No flight details or travel class provided. Please go back and select a flight.
      </div>
    );
  }

  const { flight, travelClass } = state; // Get the booked class from state

  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'Male' }]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('');

  // Update passenger details
  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  // Allow adding up to 5 passengers
  const addPassenger = () => {
    if (passengers.length < 5) {
      setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
    }
  };

  // Handle seat selection
  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  // Initiate payment process: create booking, load Razorpay, and open checkout
  const initiatePayment = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage.');
        return;
      }
      console.log('Token from localStorage:', token);

      // Validate that the number of passengers matches selected seats
      if (passengers.length !== selectedSeats.length) {
        alert('The number of passengers and selected seats must match.');
        return;
      }

      // Log the payload for debugging
      const bookingPayload = {
        flight: { ...flight, travelClass }, // Use 'travelClass' property
        passengers,
        seatNumbers: selectedSeats,
        totalAmount: flight.price * passengers.length,
      };
      console.log('Booking payload:', bookingPayload);

      // Create a booking with the flight, selected seats, passengers, and calculated total amount
      const response = await axios.post(
        `${baseURL}/bookings/create`,
        bookingPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { orderId, bookingId, amount } = response.data;
      console.log('Booking created:', { orderId, bookingId, amount });

      // Load Razorpay SDK and configure options for checkout
      const Razorpay = await loadRazorpay();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount.toString(),
        currency: 'INR',
        name: 'Flight Booking',
        order_id: orderId,
        handler: async (razorpayResponse) => {
          try {
            await axios.post(
              `${baseURL}/bookings/verify`,
              {
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
                bookingId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/booking-confirmation/${bookingId}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Payment initiation failed: ${error.response.data.message}`);
      } else {
        alert('Payment initiation failed. Please try again.');
      }
    }
  };

  return (
    <div className="booking-form-container">
      <h2>Book Your Flight</h2>

      {/* Passenger Details Form */}
      <div className="passenger-details">
        <h3>Passenger Details</h3>
        {passengers.map((passenger, index) => (
          <div key={index} className="passenger-form">
            <input
              type="text"
              placeholder="Full Name"
              value={passenger.name}
              onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={passenger.age}
              onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
              required
            />
            <select
              value={passenger.gender}
              onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        ))}
        {passengers.length < 5 && (
          <button onClick={addPassenger} className="add-passenger">
            Add Passenger
          </button>
        )}
      </div>

      {/* Seat Selection */}
      <SeatSelection
        flightId={flight.id}
        bookedClass={travelClass}
        onSeatSelect={handleSeatSelect}
      />

      {/* Payment Summary */}
      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <p>
          <strong>Flight:</strong> {flight.airline} {flight.flightNumber}
        </p>
        <p>
          <strong>From:</strong> {flight.departureAirport} <strong>To:</strong>{' '}
          {flight.arrivalAirport}
        </p>
        <p>
          <strong>Class:</strong> {travelClass}
        </p>
        <p>
          <strong>Passengers:</strong> {passengers.length}
        </p>
        <p>
          <strong>Seats Selected:</strong> {selectedSeats.join(', ') || 'None'}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{flight.price * passengers.length}
        </p>
        <button onClick={initiatePayment} className="pay-button">
          Proceed to Payment
        </button>
      </div>

      {/* Booking Status */}
      {bookingStatus && <div className="booking-status">{bookingStatus}</div>}
    </div>
  );
};

export default BookingForm;
