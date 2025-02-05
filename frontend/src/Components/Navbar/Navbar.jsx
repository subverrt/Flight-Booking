// src/Components/Navbar/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { SiConsul } from 'react-icons/si';
import { BsPhoneVibrate } from 'react-icons/bs';
import { AiOutlineGlobal } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../AuthContext'; // Import AuthContext

const Navbar = () => {
  const [active, setActive] = useState('navBarMenu');
  const [noBg, addBg] = useState('navBarTwo');

  const { user, logout } = useContext(AuthContext); // Access user and logout from AuthContext
  const navigate = useNavigate();

  // Toggle navbar visibility on mobile devices
  const showNavBar = () => setActive('navBarMenu showNavBar');
  const removeNavBar = () => setActive('navBarMenu');

  // Add background color to navbar on scroll
  const addBgColor = () => {
    if (window.scrollY >= 10) {
      addBg('navBarTwo navbar_With_Bg');
    } else {
      addBg('navBarTwo');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', addBgColor);
    return () => {
      window.removeEventListener('scroll', addBgColor);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='navBar flex'>
      {/* Top Navbar */}
      <div className="navBarOne flex">
        <div>
          <SiConsul className="icon" />
        </div>
        <div className='none flex'>
          <li className='flex'>
            <BsPhoneVibrate /> Support
          </li>
          <li className='flex'>
            <AiOutlineGlobal /> Languages
          </li>
        </div>
        <div className="atb flex">
          {user ? (
            <div className="user-profile flex">
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span>Hi, {user.name}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className={noBg}>
        <div className="logoDiv">
          <Link to="/">
            <img src={logo} className='Logo' alt="Logo" />
          </Link>
        </div>

        <div className={active}>
          <ul className="menu flex">
            <li onClick={removeNavBar} className="listItem">
              <Link to="/">Home</Link>
            </li>
            <li onClick={removeNavBar} className="listItem">
              <Link to="/about">About</Link>
            </li>
            <li onClick={removeNavBar} className="listItem">
              <Link to="/offers">Offers</Link>
            </li>
            <li onClick={removeNavBar} className="listItem">
              <Link to="/seats">Seats</Link>
            </li>
            <li onClick={removeNavBar} className="listItem">
              <Link to="/destinations">Destinations</Link>
            </li>
            {user && (
              <li onClick={removeNavBar} className="listItem">
                <Link to="/bookings">My Bookings</Link>
              </li>
            )}
          </ul>
          <button onClick={removeNavBar} className='btn flex btnOne'>
            Contact
          </button>
        </div>

        <button className='btn flex btnTwo'>
          Contact
        </button>
        <div onClick={showNavBar} className='toggleIcon'>
          <CgMenuGridO className='icon' />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
