import React, { useEffect, useState } from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { RiAccountPinCircleLine } from 'react-icons/ri';
import { RxCalendar } from 'react-icons/rx';
import Aos from 'aos';
import 'aos/dist/aos.css';

const Search = () => {
  
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);


  return (
    <div className='search container section'>
      <div data-aos='fade-up' data-aos-duration='2000' className="sectionContainer grid">
        <div className="btns flex">
          <div className="singleBtn">
            <span>Economy</span>
          </div>

          <div className="singleBtn">
            <span>Business Class</span>
          </div>

          <div className="singleBtn">
            <span>First Class</span>
          </div>

        </div>

        <div data-aos='fade-up' data-aos-duration='2000' className="searchInputs flex">

          <div className="singleInput flex">
            <div className="iconDiv">
              <HiOutlineLocationMarker className='icon'/>
            </div>
            <div className="texts">
              <h4>Location</h4>
              <input 
                type="text" 
                placeholder='Where do you want to go?'
              />
            </div>
          </div>

          <div className="singleInput flex">
            <div className="iconDiv">
              <RiAccountPinCircleLine className='icon' />
            </div>
            <div className="texts">
              <h4>Travellers</h4>
              <input 
                type="number" 
                placeholder='Add guests'
                min="1"
              />
            </div>
          </div>

          <div className="singleInput flex">
            <div className="iconDiv">
              <RxCalendar className='icon' />
            </div>
            <div className="texts">
              <h4>Check In</h4>
              <input 
                type="text" 
                placeholder="Add date"
              />
            </div>
          </div>

          <div className="singleInput flex">
            <div className="iconDiv">
              <RxCalendar className='icon' />
            </div>
            <div className="texts">
              <h4>Check Out</h4>
              <input 
                type="text" 
                placeholder="Add date"
              />
            </div>
          </div>

          <button className='btn btnBlock flex'>
            Search Flight
          </button>
        

        </div>
        
      </div>
      
    </div>
  );
};

export default Search;
