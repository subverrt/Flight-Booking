// src/Components/FlightSearch/FlightSearch.jsx

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { RiAccountPinCircleLine } from 'react-icons/ri';
import { RxCalendar } from 'react-icons/rx';
import { toast } from 'react-toastify';
import Aos from 'aos';
import 'aos/dist/aos.css';
import FlightResults from '../FlightResults/FlightResults';
import './FlightSearch.css';

const FlightSearch = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Read query parameters (if any) from URL
  const initialOrigin = searchParams.get('origin') || '';
  const initialDestination = searchParams.get('destination') || '';
  const initialDepartureDate = searchParams.get('departureDate') || '';
  const initialTravelClass = searchParams.get('travelClass') || 'Economy';
  const initialTravellers = parseInt(searchParams.get('passengers')) || 1;

  const [travelClass, setTravelClass] = useState(initialTravelClass);
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [travellers, setTravellers] = useState(initialTravellers);
  const [departureDate, setDepartureDate] = useState(initialDepartureDate);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  // Automatically fetch flights if we already have the parameters
  useEffect(() => {
    if (origin && destination && departureDate && travelClass) {
      fetchFlights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFlights = async () => {
    if (!origin || !destination || !departureDate || !travelClass) return;
    setLoading(true);
    const params = new URLSearchParams({
      origin,
      destination,
      departureDate,
      travelClass,
      passengers: travellers,
    });
    try {
      const requestUrl = `http://localhost:5000/api/flights/search?${params.toString()}`;
      const response = await fetch(requestUrl);
      const data = await response.json();
      if (response.ok) {
        if (data.flights.length === 0) {
          // Dummy data for testing if no flights returned
          setFlights([
            {
              id: 'dummy-id',
              airline: 'TestAir',
              flightNumber: 'TA123',
              departureAirport: origin,
              arrivalAirport: destination,
              departureTime: new Date().toISOString(),
              arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
              duration: '2h',
              price: 5000,
              currency: 'INR',
              class: travelClass,
              seatsAvailable: 50,
            },
          ]);
        } else {
          setFlights(data.flights);
        }
      } else {
        toast.error(data.message || 'Error fetching flights');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while searching for flights.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFlights();
  };

  return (
    <div className="flight-search container section">
      <div data-aos="fade-up" className="sectionContainer grid">
        <form onSubmit={handleSubmit}>
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
            {/* Origin Input */}
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
            {/* Destination Input */}
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
            {/* Travellers Input */}
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
            {/* Departure Date Input */}
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
            {/* Search Button */}
            <button className="btn btnBlock flex" type="submit">
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {flights.length > 0 && (
        <div className="flight-search__results" data-aos="fade-up">
          <FlightResults flights={flights} travelClass={travelClass} />
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
