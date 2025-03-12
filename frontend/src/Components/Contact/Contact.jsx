// Contact.jsx
import React, { useState, useEffect } from 'react';
import './Contact.css';
import Footer from '../Footer/Footer';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Subscribe from '../Subscribers/Subscribe';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Thank you for contacting us! We will get back to you shortly.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="contact-page">
      <div className="contact-banner" data-aos="fade-up">
        <div className="banner-overlay">
          <h1>Let's Connect</h1>
        </div>
      </div>

      <div className="contact-container section">
        <div className="contact-info-section" data-aos="fade-right">
          <div className="contact-info-card">
            <h2 className="info-section-title">Get in Touch</h2>
            <p className="info-section-text">
              Have a question or want to collaborate? We're always here to help.
            </p>

            <div className="info-items-container">
              <div className="info-item" data-aos="zoom-in" data-aos-delay="100">
                <div className="info-icon-circle">
                  <FaPhoneAlt className="info-icon" />
                </div>
                <div className="info-text">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="info-item" data-aos="zoom-in" data-aos-delay="200">
                <div className="info-icon-circle">
                  <FaEnvelope className="info-icon" />
                </div>
                <div className="info-text">
                  <h3>Email</h3>
                  <p>support@flyhigh.com</p>
                </div>
              </div>

              <div className="info-item" data-aos="zoom-in" data-aos-delay="300">
                <div className="info-icon-circle">
                  <FaMapMarkerAlt className="info-icon" />
                </div>
                <div className="info-text">
                  <h3>Office</h3>
                  <p>123 Aviation Road, City, Country</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section" data-aos="fade-left">
          <div className="form-container">
            <h2 className="form-title">Send Your Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <label className="form-label">Your Name</label>
                <span className="input-highlight"></span>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <label className="form-label">Email Address</label>
                <span className="input-highlight"></span>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="form-input textarea-input"
                ></textarea>
                <label className="form-label">Your Message</label>
                <span className="input-highlight"></span>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <FaPaperPlane className="submit-icon" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Subscribe />
      <Footer />
    </div>
  );
};

export default Contact;