// src/Components/Search/Search.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { RiAccountPinCircleLine } from 'react-icons/ri';
import { RxCalendar } from 'react-icons/rx';
import { toast } from 'react-toastify';
import Aos from 'aos';
import 'aos/dist/aos.css';

const Search = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const navigate = useNavigate();

  const [travelClass, setTravelClass] = useState('Economy');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [departureDate, setDepartureDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate || !travelClass) {
      toast.error('Please fill in all fields.');
      return;
    }
    const params = new URLSearchParams({
      origin,
      destination,
      departureDate,
      travelClass,
      passengers: travellers,
    });
    // Redirect to the dedicated flight search page with the search parameters in the URL
    navigate(`/flight-search?${params.toString()}`);
  };

  return (
    <div className="search container section">
      <div data-aos="fade-up" className="sectionContainer grid">
        <form onSubmit={handleSearch}>
          <div className="btns flex">
            {['Economy', 'Premium Economy', 'Business', 'First'].map((classType) => (
              <div
                key={classType}
                className={`singleBtn ${travelClass === classType ? 'active' : ''}`}
                onClick={() => setTravelClass(classType)}
              >
                <span>{classType}</span>
              </div>
            ))}
          </div>
          <div data-aos="fade-up" className="searchInputs flex">
            <div className="singleInput flex">
              <div className="iconDiv">
                <HiOutlineLocationMarker className="icon" />
              </div>
              <div className="texts">
                <h4>Origin</h4>
                <input
                  type="text"
                  placeholder="From (IATA code)"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
            <div className="singleInput flex">
              <div className="iconDiv">
                <HiOutlineLocationMarker className="icon" />
              </div>
              <div className="texts">
                <h4>Destination</h4>
                <input
                  type="text"
                  placeholder="To (IATA code)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
            <div className="singleInput flex">
              <div className="iconDiv">
                <RiAccountPinCircleLine className="icon" />
              </div>
              <div className="texts">
                <h4>Travellers</h4>
                <input
                  type="number"
                  min="1"
                  value={travellers}
                  onChange={(e) => setTravellers(parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
            <div className="singleInput flex">
              <div className="iconDiv">
                <RxCalendar className="icon" />
              </div>
              <div className="texts">
                <h4>Departure Date</h4>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className="btn btnBlock flex" type="submit">
              Search Flights
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
