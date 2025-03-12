// src/Components/Destinations/Destinations.jsx

import React, { useEffect } from 'react';
import './Destinations.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../Footer/Footer';
import Subscribe from '../Subscribers/Subscribe';

// Import your images at the top
import parisImage from '../../assets/paris2.jpg';      // Replace with your own image
import tokyoImage from '../../assets/tokyo.jpg';      // Replace with your own image
import sydneyImage from '../../assets/sydney.jpg';    // Replace with your own image
import newYorkImage from '../../assets/NewYork.jpg';  // Replace with your own image
import capeTownImage from '../../assets/capetown.jpg';// Replace with your own image

const Destinations = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Include your destinations data here
  const destinationsData = [
    {
      name: 'Paris, France',
      image: parisImage, // Use the imported image
      description:
        'Experience the romance and charm of Paris, the City of Lights. Visit iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.',
    },
    {
      name: 'Tokyo, Japan',
      image: tokyoImage, // Use the imported image
      description:
        'Discover the vibrant culture and cutting-edge technology in Tokyo. Enjoy delicious cuisine, historic temples, and the bustling nightlife.',
    },
    {
      name: 'Sydney, Australia',
      image: sydneyImage, // Use the imported image
      description:
        "Explore Sydney's stunning harbor, visit the iconic Sydney Opera House, and relax on beautiful beaches like Bondi and Manly.",
    },
    {
      name: 'New York City, USA',
      image: newYorkImage, // Use the imported image
      description:
        'Experience the energy of the Big Apple. Visit Times Square, Central Park, and enjoy world-class dining and entertainment.',
    },
    {
      name: 'Cape Town, South Africa',
      image: capeTownImage, // Use the imported image
      description:
        'Take in breathtaking views from Table Mountain, explore the Cape Winelands, and enjoy the rich cultural heritage of Cape Town.',
    },
    // Add more destinations as desired...
  ];

  return (
    <div className="destinations-page">
      <div className="destinations-header">
        <h1>Explore Our Top Destinations</h1>
        <p>
          Discover the most beautiful places in the world and plan your next adventure with Fly High.
        </p>
      </div>
      <div className="destinations-grid">
        {destinationsData.map((destination, index) => (
          <div
            className="destination-card"
            key={index}
            data-aos="fade-up"
            data-aos-delay={`${index * 100}`}
          >
            <div className="card-image">
              <img src={destination.image} alt={destination.name} />
            </div>
            <div className="card-content">
              <h2>{destination.name}</h2>
              <p>{destination.description}</p>
              <button className="btn explore-btn">Explore Flights</button>
            </div>
          </div>
        ))}
      </div>

      <Subscribe />
      <Footer />
    </div>
  );
};

export default Destinations;
