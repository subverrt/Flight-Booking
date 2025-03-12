import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CgMenuGridO } from 'react-icons/cg';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../AuthContext';
import Switch from '../Switch';

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [navbarBg, setNavbarBg] = useState('');
  const { user, logout } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // Toggle the mobile menu visibility
  const toggleMenu = () => setMenuActive(!menuActive);
  const closeMenu = () => setMenuActive(false);

  // Handle logout action
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    setIsDarkMode(!isDarkMode);
  };

  // Change navbar background on scroll (desktop only)
  const handleScroll = () => {
    if (window.innerWidth > 768 && window.scrollY >= 10) {
      setNavbarBg('navbar_With_Bg');
    } else {
      setNavbarBg('');
    }
  };

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for scroll events
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navBar ${navbarBg}`}>
      <div className="navbarInner flex spaceBetween alignCenter">
        {/* Left: Site Logo & Company Name */}
        <div className="logoDiv flex alignCenter">
          <Link to="/" onClick={closeMenu} className="flex alignCenter">
            <img src={logo} className="logoImg" alt="Fly High Logo" />
            <span className="companyName">Fly High</span>
          </Link>
        </div>

        {/* Slide-Down Menu (Mobile/Tablet) */}
        <div className={`menu ${menuActive ? 'active' : ''}`}>
          <ul className="menuList flex">
            <li onClick={closeMenu} className="listItem">
              <Link to="/">Home</Link>
            </li>
            <li onClick={closeMenu} className="listItem">
              <Link to="/about">About</Link>
            </li>
            <li onClick={closeMenu} className="listItem">
              <Link to="/flight-search">Search Flights</Link>
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
            {/* Mobile Auth Block */}
            {windowWidth <= 768 && (
              <li onClick={closeMenu} className="listItem mobile-auth">
                {user ? (
                  <div className="mobile-auth-container">
                    <button onClick={handleLogout} className="logoutButton">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="mobile-auth-container">
                    <Link to="/login" className="navLink">
                      Sign In
                    </Link>
                    <Link to="/signup" className="navLink">
                      Sign Up
                    </Link>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* Right Section */}
        <div className="rightSection flex alignCenter">
          <Switch onChange={toggleDarkMode} checked={isDarkMode} />

          {/* Desktop Auth Block (screens >768px) */}
          {windowWidth > 768 && (
            <div className="auth desktop-auth flex alignCenter">
              {user ? (
                <div className="userProfile flex alignCenter">
                  <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <button onClick={handleLogout} className="logoutButton">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="authLinks flex alignCenter">
                  <Link to="/login" className="navLink">
                    Sign In
                  </Link>
                  <Link to="/signup" className="navLink">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle Icon (screens ≤768px) */}
          {windowWidth <= 768 && (
            <div className="toggleIcon" onClick={toggleMenu}>
              {user ? (
                <div className="toggleAvatar">{user.name.charAt(0).toUpperCase()}</div>
              ) : (
                <CgMenuGridO className="icon" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
