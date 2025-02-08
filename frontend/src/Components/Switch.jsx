// Switch.jsx
import React from 'react';
import styled from 'styled-components';

const Switch = ({ onChange, checked }) => {
  return (
    <StyledWrapper>
      <input
        type="checkbox"
        className="theme-checkbox"
        onChange={onChange}
        checked={checked}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .theme-checkbox {
    --toggle-size: 12px; /* 75% of the original 16px */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 4.6875em; /* 75% of the original 6.25em */
    height: 2.34375em; /* 75% of the original 3.125em */
    background: -webkit-gradient(linear, left top, right top, color-stop(50%, #efefef), color-stop(50%, #2a2a2a)) no-repeat;
    background: -o-linear-gradient(left, #efefef 50%, #2a2a2a 50%) no-repeat;
    background: linear-gradient(to right, #efefef 50%, #2a2a2a 50%) no-repeat;
    background-size: 205%;
    background-position: 0;
    -webkit-transition: 0.4s;
    -o-transition: 0.4s;
    transition: 0.4s;
    border-radius: 99em;
    position: relative;
    cursor: pointer;
    font-size: var(--toggle-size);
  }

  .theme-checkbox::before {
    content: "";
    width: 1.6875em; /* 75% of the original 2.25em */
    height: 1.6875em; /* 75% of the original 2.25em */
    position: absolute;
    top: 0.3285em; /* 75% of the original 0.438em */
    left: 0.3285em; /* 75% of the original 0.438em */
    background: -webkit-gradient(linear, left top, right top, color-stop(50%, #efefef), color-stop(50%, #2a2a2a)) no-repeat;
    background: -o-linear-gradient(left, #efefef 50%, #2a2a2a 50%) no-repeat;
    background: linear-gradient(to right, #efefef 50%, #2a2a2a 50%) no-repeat;
    background-size: 205%;
    background-position: 100%;
    border-radius: 50%;
    -webkit-transition: 0.4s;
    -o-transition: 0.4s;
    transition: 0.4s;
  }

  .theme-checkbox:checked::before {
    left: calc(100% - 1.6875em - 0.3285em); /* Adjust based on width and left position */
    background-position: 0;
  }

  .theme-checkbox:checked {
    background-position: 100%;
  }
`;

export default Switch;
