// BookingConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // We'll use jsPDF for PDF generation (see below)
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to fetch booking details');
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  const cancelBooking = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${baseURL}/bookings/cancel/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
      // Optionally, redirect user to a different page (e.g., bookings list)
      navigate('/bookings');
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  // Generate PDF of the booking details using jsPDF
  const downloadPDF = () => {
    if (!booking) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Booking Confirmation', 20, 20);
    doc.setFontSize(12);
    let y = 30;
    doc.text(`Booking ID: ${booking._id}`, 20, y);
    y += 10;
    doc.text(`Flight: ${booking.flight?.airline} - ${booking.flight?.flightNumber}`, 20, y);
    y += 10;
    doc.text(`From: ${booking.flight?.departureAirport}`, 20, y);
    y += 10;
    doc.text(`To: ${booking.flight?.arrivalAirport}`, 20, y);
    y += 10;
    doc.text(
      `Departure: ${new Date(booking.flight?.departureTime).toLocaleString()}`,
      20,
      y
    );
    y += 10;
    doc.text(`Seats Selected: ${booking.seats ? booking.seats.join(', ') : 'None'}`, 20, y);
    y += 10;
    doc.text(`Total Amount: ₹${booking.totalAmount}`, 20, y);
    y += 10;
    doc.text('Passenger Details:', 20, y);
    y += 10;
    booking.passengers.forEach((passenger, index) => {
      doc.text(
        `${index + 1}. ${passenger.name} (${passenger.age} years, ${passenger.gender})`,
        20,
        y
      );
      y += 10;
    });
    // Save the PDF with a filename
    doc.save(`Booking_${booking._id}.pdf`);
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="booking-confirmation container">
      <h2>Booking Confirmation</h2>
      {booking ? (
        <div className="confirmation-details">
          <h3>Payment Successful! 🎉</h3>
          <p><strong>Booking ID:</strong> {booking._id}</p>
          <p>
            <strong>Flight:</strong> {booking.flight?.flightNumber} ({booking.flight?.airline})
          </p>
          <p>
            <strong>Departure:</strong> {booking.flight?.departureAirport} at {new Date(booking.flight?.departureTime).toLocaleString()}
          </p>
          <p>
            <strong>Arrival:</strong> {booking.flight?.arrivalAirport} at {new Date(booking.flight?.arrivalTime).toLocaleString()}
          </p>
          <p>
            <strong>Seats Selected:</strong> {booking.seats && booking.seats.length > 0 ? booking.seats.join(', ') : 'None'}
          </p>
          <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
          <p><strong>Passengers:</strong></p>
          <ul>
            {booking.passengers && booking.passengers.length > 0 ? (
              booking.passengers.map((passenger, index) => (
                <li key={index}>
                  {passenger.name} ({passenger.age} years, {passenger.gender})
                </li>
              ))
            ) : (
              <p>No passenger information available.</p>
            )}
          </ul>
          <p>Your tickets will be sent to your registered email.</p>

          <div className="action-buttons">
            <button onClick={downloadPDF} className="btn download-btn">
              Download PDF
            </button>
            <button onClick={cancelBooking} className="btn cancel-btn">
              Cancel Booking
            </button>
          </div>
        </div>
      ) : (
        <p>No booking details available.</p>
      )}
    </div>
  );
};

export default BookingConfirmation;
