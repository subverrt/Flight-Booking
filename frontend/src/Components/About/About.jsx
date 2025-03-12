// src/Components/About/About.jsx

import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaStar, FaPlane } from 'react-icons/fa';
import Footer from '../Footer/Footer';
import Subscribe from '../Subscribers/Subscribe';

// Import images and videos from the assets folder
import heroImage from '../../assets/hero-image.jpg'; // Replace with your hero image
import videoFile from '../../assets/our-story-video.mp4'; // Replace with your story video
import teamMember1 from '../../assets/team-member1.png'; // Replace with your team member images
import teamMember2 from '../../assets/team-member2.png';
import ctaImage from '../../assets/cta-background.jpg'; // Replace with your CTA background image

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Image */}
        <img src={heroImage} alt="Fly High" />
        <div className="overlay">
          <h1>Experience the World Like Never Before</h1>
          <p>Your journey begins with Fly High.</p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us section container">
        <h2>About Fly High</h2>
        <p>
          At Fly High, we're committed to connecting people and places. With a fleet of modern
          aircraft and a dedicated team, we offer an unparalleled travel experience to destinations
          worldwide.
        </p>
      </section>

      {/* Services Section */}
      <section className="services section container">
        <h2>What We Offer</h2>
        <div className="services-grid">
          <div className="service-item">
            {/* Service Icon */}
            <FaGlobeAmericas className="icon" />
            <h3>Worldwide Destinations</h3>
            <p>Travel to over 100 destinations across the globe with ease and comfort.</p>
          </div>
          <div className="service-item">
            <FaStar className="icon" />
            <h3>Exceptional Service</h3>
            <p>Experience top-notch customer service from booking to landing.</p>
          </div>
          <div className="service-item">
            <FaPlane className="icon" />
            <h3>Comfort & Luxury</h3>
            <p>Enjoy the latest amenities and comfort features on all our flights.</p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section section">
        <h2>Our Story</h2>
        {/* Story Video */}
        <video src={videoFile} controls poster={heroImage} />
      </section>

      {/* Team Section */}
      <section className="team section container">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            {/* Team Member Photo */}
            <img src={teamMember1} alt="John Doe" />
            <h3>John Doe</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <img src={teamMember2} alt="Jane Smith" />
            <h3>Jane Smith</h3>
            <p>Chief Pilot</p>
          </div>
          {/* Add more team members as needed */}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        {/* CTA Background Image */}
        <img src={ctaImage} alt="Ready to Fly?" />
        <div className="overlay">
          <h2>Ready to Take Off?</h2>
          <p>Book your flight with us today and start your adventure.</p>
          <Link to="/flight-search" className="btn">
            Book Now
          </Link>
        </div>
      </section>

      <Subscribe />
      <Footer />
    </div>
  );
};

export default About;
