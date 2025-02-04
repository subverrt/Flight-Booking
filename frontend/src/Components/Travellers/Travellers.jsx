import React, { useEffect } from "react";

import paris from "../../assets/paris.jpeg";
import NewYork from "../../assets/NewYork.jpg";
import london from "../../assets/london.png";
import dubai from "../../assets/dubai.jpg";

import traveler1 from "../../assets/user (1).jpg";
import traveler2 from "../../assets/user (2).jpg";
import traveler3 from "../../assets/user (3).jpg";
import traveler4 from "../../assets/user (4).jpg";

import Aos from "aos";
import "aos/dist/aos.css";

const travelers = [
  {
    id: 1,
    destinationImage: paris,
    travelerImage: traveler1,
    travelerName: "Subverrt",
    socialLink: "@_subverrt",
  },
  {
    id: 2,
    destinationImage: NewYork,
    travelerImage: traveler2,
    travelerName: "Subverrt",
    socialLink: "@_subverrt",
  },
  {
    id: 3,
    destinationImage: london,
    travelerImage: traveler3,
    travelerName: "Subverrt",
    socialLink: "@_subverrt",
  },
  {
    id: 4,
    destinationImage: dubai,
    travelerImage: traveler4,
    travelerName: "Subverrt",
    socialLink: "@_subverrt",
  },
];

const Travellers = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className="travelers container section">
      <div className="sectionContainer">
        <h2 data-aos="fade-up" data-aos-duration="2500">
          Top travelers of this month!
        </h2>
        <div className="travelersContainer grid">
          {travelers.map(
            ({
              id,
              destinationImage,
              travelerImage,
              travelerName,
              socialLink,
            }) => (
              <div
                data-aos="fade-up"
                data-aos-duration="2500"
                key={id}
                className="singleTraveler"
              >
                <img
                  src={destinationImage}
                  className="destinationImage"
                  alt="destination"
                />
                <div className="travelerDetails">
                  <div className="travelersPicture">
                    <img
                      src={travelerImage}
                      className="travelerImage"
                      alt="traveler"
                    />
                  </div>
                  <div className="travelerName">
                    <span>{travelerName}</span>
                    <p>{socialLink}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Travellers;
