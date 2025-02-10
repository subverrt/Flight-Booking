// frontend/src/Components/Bookings/Bookings.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // For PDF generation
import 'jspdf-autotable'; // For generating tables in PDF
import logo from '../../assets/logo.png';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch bookings from the backend (including cancelled ones)
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      console.log('Token obtained from localStorage:', token);
      try {
        const response = await fetch('http://localhost:5000/api/users/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Bookings fetched successfully:', data);
          setBookings(data.bookings);
        } else {
          console.error('Error fetching bookings:', data.message);
          setErrorMessage(data.message || 'Error fetching bookings');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Error fetching bookings');
      }
    };

    fetchBookings();
  }, [user]);

  // Cancel booking: update the bookingStatus to 'cancelled' in the backend,
  // and update it in the state.
  const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem('token');
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await axios.delete(`${baseURL}/bookings/cancel/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
      // Update the bookingStatus in state
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b
        )
      );
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Failed to cancel booking.');
    }
  };

  // Generate a PDF ticket that looks like a real airplane ticket.
  const downloadPDF = (booking) => {
    if (!booking) return;

    // Create a new jsPDF instance (landscape, A4)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'A4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Draw background color for the ticket
    doc.setFillColor(245, 245, 245); // Light grey background
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Draw header band
    doc.setFillColor(30, 144, 255); // Dodger Blue header
    doc.rect(0, 0, pageWidth, 80, 'F');

    // Add your logo in the header.
    // Replace 'your-logo.png' with the path to your actual logo
    // or a Base64-encoded string of your logo image.
    const logoBase64 = 'data:image/png;base64,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'; // Replace with your Base64 logo string

    // If you're using a local image
    // doc.addImage('your-logo.png', 'PNG', 30, 20, 100, 40);

    // Title text in header
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Flight Ticket', pageWidth / 2, 50, { align: 'center' });

    // Draw flight details section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const marginLeft = 40;
    let currentY = 120;

    doc.text(`Booking ID: ${booking._id}`, marginLeft, currentY);
    currentY += 20;
    doc.text(`Airline: ${booking.flight?.airlineCode}`, marginLeft, currentY);
    currentY += 20;
    doc.text(`Flight No: ${booking.flight?.flightNumber}`, marginLeft, currentY);
    currentY += 20;
    doc.text(`Departure Airport: ${booking.flight?.departureAirport}`, marginLeft, currentY);
    currentY += 20;
    doc.text(`Arrival Airport: ${booking.flight?.arrivalAirport}`, marginLeft, currentY);
    currentY += 20;
    doc.text(`Departure Time: ${new Date(booking.flight?.departureTime).toLocaleString()}`, marginLeft, currentY);
    currentY += 20;
    doc.text(`Arrival Time: ${new Date(booking.flight?.arrivalTime).toLocaleString()}`, marginLeft, currentY);
    currentY += 20;
    doc.text(`Seats: ${booking.seats ? booking.seats.join(', ') : 'None'}`, marginLeft, currentY);
    currentY += 20;
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleString()}`, marginLeft, currentY);
    currentY += 30;

    // Draw a separator line
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
    currentY += 20;

    // Passenger Details Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Passenger Details', marginLeft, currentY);
    currentY += 10;

    doc.autoTable({
      startY: currentY,
      head: [['#', 'Name', 'Age', 'Gender']],
      body: booking.passengers.map((passenger, index) => [
        index + 1,
        passenger.name,
        passenger.age,
        passenger.gender,
      ]),
      theme: 'grid',
      margin: { left: marginLeft, right: marginLeft },
      styles: { font: 'helvetica', fontSize: 12 },
      headStyles: { fillColor: [30, 144, 255] }, // Dodger Blue header
    });

    // Draw barcode (simulated)
    const barcodeY = pageHeight - 80;
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    let barcodeX = marginLeft;
    for (let i = 0; i < 100; i++) {
      doc.line(barcodeX, barcodeY, barcodeX, barcodeY + 40);
      barcodeX += 3;
    }

    // Footer text
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'Thank you for choosing our airline! Have a pleasant journey.',
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );

    // Save the PDF with a filename that includes the booking ID
    doc.save(`Ticket_${booking._id}.pdf`);
  };

  return (
    <div className="bookings container">
      <h2>Your Bookings</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <div key={index} className="booking-card">
            <h3>
              Airline: {booking.flight.airlineCode} - Flight {booking.flight.flightNumber}
            </h3>
            <p>
              <strong>From:</strong> {booking.flight.departureAirport}
            </p>
            <p>
              <strong>To:</strong> {booking.flight.arrivalAirport}
            </p>
            <p>
              <strong>Departure:</strong> {new Date(booking.flight.departureTime).toLocaleString()}
            </p>
            <p>
              <strong>Arrival:</strong> {new Date(booking.flight.arrivalTime).toLocaleString()}
            </p>
            <p>
              <strong>Seats Selected:</strong>{' '}
              {booking.seats && booking.seats.length > 0 ? booking.seats.join(', ') : 'None'}
            </p>
            <p>
              <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()}
            </p>
            <div className="action-buttons">
              <button onClick={() => downloadPDF(booking)} className="btn download-btn">
                Download Ticket
              </button>
              {booking.bookingStatus === 'cancelled' ? (
                <button className="btn cancelled-btn" disabled>
                  Cancelled
                </button>
              ) : (
                <button onClick={() => cancelBooking(booking._id)} className="btn cancel-btn">
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>You have no bookings.</p>
      )}
    </div>
  );
};

export default Bookings;
