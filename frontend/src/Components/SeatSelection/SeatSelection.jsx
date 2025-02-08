import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeatSelection.css';

// Dummy seat data for development/fallback (simulate a real airplane seat map)
const dummySeats = [
  { seatNumber: "1A", isBooked: false },
  { seatNumber: "1B", isBooked: true },
  { seatNumber: "1C", isBooked: false },
  { seatNumber: "1D", isBooked: false },
  { seatNumber: "2A", isBooked: false },
  { seatNumber: "2B", isBooked: false },
  { seatNumber: "2C", isBooked: false },
  { seatNumber: "2D", isBooked: true },
  { seatNumber: "3A", isBooked: false },
  { seatNumber: "3B", isBooked: false },
  { seatNumber: "3C", isBooked: true },
  { seatNumber: "3D", isBooked: false },
  // Add more rows as needed
];

const SeatSelection = ({ flightId, onSeatSelect }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchSeatMap = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/flights/${flightId}/seatmap`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSeats(response.data.seats || []);
      } catch (error) {
        // If a 401 Unauthorized error occurs, use dummy seat data
        if (error.response && error.response.status === 401) {
          console.warn('Unauthorized: Using dummy seat map data for development.');
          setSeats(dummySeats);
        } else {
          console.error('Error fetching seat map:', error);
        }
      }
    };
    fetchSeatMap();
  }, [flightId]);

  // Group seats by row based on the numeric part of the seat number
  const groupSeatsByRow = (seats) => {
    const rows = {};
    seats.forEach((seat) => {
      const match = seat.seatNumber.match(/^\d+/);
      if (match) {
        const rowNumber = match[0];
        if (!rows[rowNumber]) {
          rows[rowNumber] = [];
        }
        rows[rowNumber].push(seat);
      }
    });
    // Convert the rows object into a sorted array
    return Object.keys(rows)
      .sort((a, b) => Number(a) - Number(b))
      .map((rowNumber) => ({
        rowNumber,
        seats: rows[rowNumber].sort((a, b) => {
          const letterA = a.seatNumber.replace(/^\d+/, '');
          const letterB = b.seatNumber.replace(/^\d+/, '');
          return letterA.localeCompare(letterB);
        }),
      }));
  };

  const handleSeatClick = (seat) => {
    if (!seat.isBooked) {
      const newSelectedSeats = selectedSeats.includes(seat.seatNumber)
        ? selectedSeats.filter((s) => s !== seat.seatNumber)
        : [...selectedSeats, seat.seatNumber];
      setSelectedSeats(newSelectedSeats);
      onSeatSelect(newSelectedSeats);
    }
  };

  if (seats.length === 0) {
    return <div>Loading seat map...</div>;
  }

  const groupedSeats = groupSeatsByRow(seats);

  return (
    <div className="seat-map-container">
      {groupedSeats.map((row) => (
        <div key={row.rowNumber} className="seat-row">
          <div className="row-number">{row.rowNumber}</div>
          {row.seats.map((seat) => (
            <div
              key={seat.seatNumber}
              className={`seat ${seat.isBooked ? 'booked' : 'available'} ${
                selectedSeats.includes(seat.seatNumber) ? 'selected' : ''
              }`}
              onClick={() => handleSeatClick(seat)}
            >
              {/* Show only the letter portion for clarity */}
              {seat.seatNumber.replace(row.rowNumber, '')}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SeatSelection;
