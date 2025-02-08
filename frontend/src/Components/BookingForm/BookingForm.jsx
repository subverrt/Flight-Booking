import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadRazorpay } from '../../utils/razorpay';
import SeatSelection from '../SeatSelection/SeatSelection';
import './BookingForm.css';

const BookingForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Ensure flight details exist
  if (!state || !state.flight) {
    return <div>No flight details provided. Please go back and select a flight.</div>;
  }
  
  const { flight } = state;
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'Male' }]);
  const [selectedSeats, setSelectedSeats] = useState([]);

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

  // Initiate payment process: create booking, load Razorpay, and open checkout
  const initiatePayment = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }
      console.log("Token from localStorage:", token);
      
      // Create a booking with the flight, selected seats, passengers, and calculated total amount
      const response = await axios.post(
        `${baseURL}/bookings/create`,
        {
          flight,
          selectedSeats,
          passengers,
          totalAmount: flight.price * passengers.length
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const { orderId, bookingId, amount } = response.data;
      console.log("Booking created:", { orderId, bookingId, amount });

      // Load Razorpay SDK and configure options for checkout
      const Razorpay = await loadRazorpay();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount.toString(),
        currency: "INR",
        name: "Flight Booking",
        order_id: orderId,
        handler: async (razorpayResponse) => {
          try {
            await axios.post(
              `${baseURL}/bookings/verify`,
              {
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
                bookingId
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/booking-confirmation/${bookingId}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || ''
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <div className="booking-form">
      <h3>Passenger Details</h3>
      {passengers.map((passenger, index) => (
        <div key={index} className="passenger-form">
          <input
            type="text"
            placeholder="Full Name"
            value={passenger.name}
            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={passenger.age}
            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
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
      <button onClick={addPassenger} className="add-passenger">
        Add Passenger
      </button>

      {/* Render SeatSelection for selecting seats */}
      <SeatSelection flightId={flight.id} onSeatSelect={setSelectedSeats} />

      <div className="payment-summary">
        <h4>Total: ₹{flight.price * passengers.length}</h4>
        <p><strong>Seats Selected:</strong> {selectedSeats.join(', ') || 'None'}</p>
        <button onClick={initiatePayment} className="pay-button">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
