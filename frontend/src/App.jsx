import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Search from './Components/Search/Search';
import Support from './Components/Support/Support';
import Info from './Components/Info/Info';
import Lounge from './Components/Lounge/Lounge';
import Travellers from './Components/Travellers/Travellers';
import Subscribe from './Components/Subscribers/Subscribe';
import Footer from './Components/Footer/Footer';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import OtpVerification from './Components/Auth/OtpVerification';
import Bookings from './Components/Bookings/Bookings';
import BookingConfirmation from './Components/BookingConfirmation/BookingConfirmation';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar/>
        <ToastContainer />

        <Routes>
          {/* Main page route */}
          <Route path="/" element={
            <>
              <Home/>
              <Search/>
              <Support/>
              <Info/>
              <Lounge/>
              <Travellers/>
              <Subscribe/>
              <Footer/>
            </>
          }/>

          {/* Auth routes */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/verify-otp" element={<OtpVerification/>}/>

          {/* Protected routes */}
          <Route path="/bookings" element={
            <ProtectedRoute>
              <Bookings/>
            </ProtectedRoute>
          }/>

          <Route path="/booking-confirmation" element={
            <ProtectedRoute>
              <BookingConfirmation/>
            </ProtectedRoute>
          }/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
