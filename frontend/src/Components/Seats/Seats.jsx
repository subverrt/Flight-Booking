// src/Components/Seats/Seats.jsx

import React, { useEffect } from 'react';
import './Seats.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../Footer/Footer';
import Subscribe from '../Subscribers/Subscribe';

// Import images
import ctaImage from '../../assets/cta.jpg'; 
import economyImage from '../../assets/economy.jpg';
import premiumEconomyImage from '../../assets/premium.jpg';
import businessImage from '../../assets/business.jpg';
import firstClassImage from '../../assets/firstclass.jpg';

const Seats = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Seating options data
  const seatsData = [
    {
      name: 'Economy Class',
      image: economyImage,
      description:
        'Affordable and comfortable seating with complimentary snacks and beverages. Enjoy in-flight entertainment and Wi-Fi access on selected flights.',
    },
    {
      name: 'Premium Economy',
      image: premiumEconomyImage,
      description:
        'Extra legroom and wider seats for added comfort. Enjoy priority boarding, upgraded meals, and enhanced in-flight services.',
    },
    {
      name: 'Business Class',
      image: businessImage,
      description:
        'Experience luxury with fully reclining seats, gourmet dining, and exclusive lounge access. Ideal for business travelers seeking comfort and convenience.',
    },
    {
      name: 'First Class',
      image: firstClassImage,
      description:
        'Indulge in ultimate luxury with private suites, personalized service, and exquisite dining options. Enjoy access to premium lounges and priority services.',
    },
  ];

  return (
    <div className="seats-page">
      {/* Hero Banner Section */}
      <div
        className="seats-header"
        style={{
          backgroundImage: `url(${ctaImage})`,
        }}
      >
        {/* Overlay for darkening the background */}
        <div className="header-overlay"></div>

        {/* Text Content */}
        <div className="header-content">
          <h1>Choose Your Preferred Class</h1>
          <p>
            Explore our seating options and find the perfect class to suit your needs 
            and preferences.
          </p>
          {/* If you want a button, uncomment below:
          <button className="cta-btn">Learn More</button> */}
        </div>
      </div>

      {/* Seats Grid */}
      <div className="seats-grid">
        {seatsData.map((seat, index) => (
          <div
            className="seat-card"
            key={index}
            data-aos="fade-up"
            data-aos-delay={`${index * 100}`}
          >
            <div className="seat-image">
              <img src={seat.image} alt={seat.name} />
            </div>
            <div className="seat-content">
              <h2>{seat.name}</h2>
              <p>{seat.description}</p>
              <button className="btn select-btn">Select {seat.name}</button>
            </div>
          </div>
        ))}
      </div>

      <Subscribe />
      <Footer />
    </div>
  );
};

export default Seats;
