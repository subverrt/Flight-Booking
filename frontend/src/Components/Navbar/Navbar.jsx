// src/Components/Navbar/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { CgMenuGridO } from 'react-icons/cg';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../AuthContext';

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [navbarBg, setNavbarBg] = useState('');
  const { user, logout } = useContext(AuthContext);
  const [showSignout, setShowSignout] = useState(false);
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMenu = () => setMenuActive(!menuActive);
  const closeMenu = () => setMenuActive(false);

  // Toggle the signout button when clicking on the username
  const toggleSignout = () => {
    setShowSignout((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Toggle Dark Mode by adding/removing a class on the body
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

  // Change navbar background on scroll
  const handleScroll = () => {
    if (window.scrollY >= 10) {
      setNavbarBg('navbar_With_Bg');
    } else {
      setNavbarBg('');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navBar flex ${navbarBg}`}>
      <div className="navbarInner flex">
        {/* Logo */}
        <div className="logoDiv">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} className="Logo" alt="Logo" />
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className={`menu flex ${menuActive ? 'active' : ''}`}>
          <ul className="menuList flex">
            <li onClick={closeMenu} className="listItem">
              <Link to="/">Home</Link>
            </li>
            <li onClick={closeMenu} className="listItem">
              <Link to="/about">About</Link>
            </li>
            <li onClick={closeMenu} className="listItem">
              <Link to="/offers">Offers</Link>
            </li>
            <li onClick={closeMenu} className="listItem">
              <Link to="/seats">Seats</Link>
            </li>
            <li onClick={closeMenu} className="listItem">
              <Link to="/destinations">Destinations</Link>
            </li>
            {user && (
              <li onClick={closeMenu} className="listItem">
                <Link to="/bookings">My Bookings</Link>
              </li>
            )}
            <li onClick={closeMenu} className="listItem">
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Dark Mode toggle & Auth */}
        <div className="rightSection flex">
          <button onClick={toggleDarkMode} className="dark-mode-toggle" title="Toggle Dark Mode">
            🌙
          </button>
          <div className="auth flex">
            {user ? (
              <div className="userProfile" onClick={toggleSignout}>
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="userGreeting">Hi, {user.name}</span>
                {showSignout && (
                  <button onClick={handleLogout} className="logout-button">
                    Sign Out
                  </button>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Sign In
                </Link>
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="toggleIcon" onClick={toggleMenu}>
            <CgMenuGridO className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
