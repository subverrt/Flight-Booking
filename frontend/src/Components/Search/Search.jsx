import React, { useEffect, useState } from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { RiAccountPinCircleLine } from 'react-icons/ri';
import { RxCalendar } from 'react-icons/rx';
import { toast } from 'react-toastify';
import Aos from 'aos';
import 'aos/dist/aos.css';

import FlightResults from './FlightResults';

const Search = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const [travelClass, setTravelClass] = useState('ECONOMY');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [departureDate, setDepartureDate] = useState('');
  const [flights, setFlights] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Validation
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

    try {
      const response = await fetch(`http://localhost:5000/api/flights/search?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setFlights(data.flights);
      } else {
        toast.error(data.message || 'Error fetching flights');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while searching for flights.');
    }
  };

  return (
    <div className='search container section'>
      <div data-aos='fade-up' data-aos-duration='2000' className="sectionContainer grid">
        <form onSubmit={handleSearch}>
          <div className="btns flex">
            {['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'].map((classType) => (
              <div
                key={classType}
                className={`singleBtn ${travelClass === classType ? 'active' : ''}`}
                onClick={() => setTravelClass(classType)}
              >
                <span>{classType.replace('_', ' ')}</span>
              </div>
            ))}
          </div>

          <div data-aos='fade-up' data-aos-duration='2000' className="searchInputs flex">
            <div className="singleInput flex">
              <div className="iconDiv">
                <HiOutlineLocationMarker className='icon' />
              </div>
              <div className="texts">
                <h4>Origin</h4>
                <input
                  type="text"
                  placeholder='From (IATA code)'
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            <div className="singleInput flex">
              <div className="iconDiv">
                <HiOutlineLocationMarker className='icon' />
              </div>
              <div className="texts">
                <h4>Destination</h4>
                <input
                  type="text"
                  placeholder='To (IATA code)'
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            <div className="singleInput flex">
              <div className="iconDiv">
                <RiAccountPinCircleLine className='icon' />
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
                <RxCalendar className='icon' />
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

            <button className='btn btnBlock flex' type="submit">
              Search Flights
            </button>
          </div>
        </form>
      </div>

      {/* Display flight results */}
      {flights.length > 0 && <FlightResults flights={flights} />}
    </div>
  );
};

export default Search;
