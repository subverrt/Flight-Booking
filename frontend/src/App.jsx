import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <Router>
      <div>
        <Navbar/>
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;