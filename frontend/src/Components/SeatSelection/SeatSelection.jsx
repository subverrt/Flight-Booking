// SeatSelection.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeatSelection.css';

const SeatSelection = ({ flightId, bookedClass, onSeatSelect }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchSeatMap = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/flights/${flightId}/seatmap`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSeats(response.data.seats || []);
      } catch (error) {
        console.error('Error fetching seat map:', error);
      }
    };
    fetchSeatMap();
  }, [flightId]);

  // Group seats by row
  const groupSeatsByRow = (seats) => {
    const rows = {};
    seats.forEach((seat) => {
      const match = seat.seatNumber.match(/^(\d+)/);
      if (match) {
        const rowNumber = match[1];
        if (!rows[rowNumber]) {
          rows[rowNumber] = [];
        }
        rows[rowNumber].push(seat);
      }
    });

    // Sort rows numerically and seats within each row alphabetically
    return Object.keys(rows)
      .sort((a, b) => Number(a) - Number(b))
      .map((rowNumber) => ({
        rowNumber,
        seats: rows[rowNumber].sort((a, b) => {
          const seatA = a.seatNumber.replace(/^\d+/, '');
          const seatB = b.seatNumber.replace(/^\d+/, '');
          return seatA.localeCompare(seatB);
        }),
      }));
  };

  const handleSeatClick = (seat) => {
    const seatClass = seat.class ? seat.class.toLowerCase() : '';
    const userBookedClass = bookedClass ? bookedClass.toLowerCase() : '';

    if (!seat.isBooked && seatClass === userBookedClass) {
      const isSelected = selectedSeats.includes(seat.seatNumber);
      let newSelectedSeats;

      if (isSelected) {
        newSelectedSeats = selectedSeats.filter((s) => s !== seat.seatNumber);
      } else {
        newSelectedSeats = [...selectedSeats, seat.seatNumber];
      }

      setSelectedSeats(newSelectedSeats);
      onSeatSelect(newSelectedSeats);
    }
  };

  if (seats.length === 0) {
    return <div>Loading seat map...</div>;
  }

  const groupedSeats = groupSeatsByRow(seats);

  return (
    <div className="seat-selection-wrapper">
      <div className="seat-map-container">
        <h3>Select Your Seats ({bookedClass || 'Unknown'} Class)</h3>
        <div className="seat-map">
          {groupedSeats.map((row) => (
            <div key={row.rowNumber} className="seat-row">
              <div className="row-number">{row.rowNumber}</div>
              {row.seats.map((seat) => {
                const seatClass = seat.class ? seat.class.toLowerCase() : '';
                const userBookedClass = bookedClass ? bookedClass.toLowerCase() : '';
                const isDisabled = seatClass !== userBookedClass;

                return (
                  <div
                    key={seat.seatNumber}
                    className={`seat ${
                      seat.isBooked
                        ? 'booked'
                        : isDisabled
                        ? 'disabled'
                        : 'available'
                    } ${selectedSeats.includes(seat.seatNumber) ? 'selected' : ''} ${
                      seat.type ? seat.type.toLowerCase() : ''
                    } ${
                      seat.class ? seat.class.toLowerCase().replace(' ', '-') : ''
                    }`}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat.seatNumber.replace(row.rowNumber, '')}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legends */}
        <div className="legend">
          <div>
            <span className="seat available"></span> Available
          </div>
          <div>
            <span className="seat selected"></span> Selected
          </div>
          <div>
            <span className="seat booked"></span> Booked
          </div>
          <div>
            <span className="seat disabled"></span> Not Available
          </div>
          <div>
            <span className="seat first"></span> First Class
          </div>
          <div>
            <span className="seat business"></span> Business Class
          </div>
          <div>
            <span className="seat premium-economy"></span> Premium Economy
          </div>
          <div>
            <span className="seat economy"></span> Economy Class
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
