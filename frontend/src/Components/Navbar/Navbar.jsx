import React, { useState, useEffect } from 'react';
import { SiConsul } from 'react-icons/si';
import { BsPhoneVibrate } from 'react-icons/bs';
import { AiOutlineGlobal } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [active, setActive] = useState('navBarMenu');
  const [noBg, addBg] = useState('navBarTwo');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Existing navbar functions
  const showNavBar = () => setActive('navBarMenu showNavBar');
  const removeNavBar = () => setActive('navBarMenu');
  
  const addBgColor = () => {
    window.scrollY >= 10 ? addBg('navBarTwo navbar_With_Bg') : addBg('navBarTwo');
  };
  window.addEventListener('scroll', addBgColor);

  // New auth logic
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.name) {
          setIsLoggedIn(true);
          setUser(data);
        }
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <div className='navBar flex'>
      <div className="navBarOne flex">
        <div>
          <SiConsul className="icon"/>
        </div>
        <div className='none flex'>
          <li className='flex'> <BsPhoneVibrate/>Support</li>
          <li className='flex'><AiOutlineGlobal/>Languages</li>
        </div>
        <div className="atb flex">
          {isLoggedIn ? (
            <div className="user-profile flex">
              <div className="avatar">{user?.name[0]}</div>
              <span>Hi, {user?.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <div className={noBg}>
        <div className="logoDiv">
          <img src={logo} className='Logo' alt="Logo"/>
        </div>

        <div className={active}>
          <ul className="menu flex">
            <li onClick={removeNavBar} className="listItem">Home</li>
            <li onClick={removeNavBar} className="listItem">About</li>
            <li onClick={removeNavBar} className="listItem">Offers</li>
            <li onClick={removeNavBar} className="listItem">Seats</li>
            <li onClick={removeNavBar} className="listItem">Destinations</li>
          </ul>
          <button onClick={removeNavBar} className='btn flex btnOne'>
            Contact
          </button>
        </div>

        <button className='btn flex btnTwo'>
          Contact
        </button>
        <div onClick={showNavBar} className='toggleIcon'>
          <CgMenuGridO className='icon'/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;