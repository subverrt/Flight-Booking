// backend/utils/seatMapGenerator.js

// Function to generate a realistic seat map based on the aircraft type
const generateSeatMap = (aircraftType) => {
    let seatMap = [];
    let rows, seatLayout;
  
    // Define seat configurations for different aircraft types
    switch (aircraftType) {
      case '320':
      case 'A320':
        rows = 30;
        seatLayout = ['A', 'B', 'C', 'D', 'E', 'F'];
        break;
      case '737':
      case 'B737':
        rows = 32;
        seatLayout = ['A', 'B', 'C', 'D', 'E', 'F'];
        break;
      case '380':
      case 'A380':
        rows = 50;
        seatLayout = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
        break;
      default:
        // Default aircraft configuration
        rows = 25;
        seatLayout = ['A', 'B', 'C', 'D'];
        break;
    }
  
    // Calculate the number of rows for each class
    let firstClassRows = Math.floor(rows * 0.1); // 10% of rows
    let businessClassRows = Math.floor(rows * 0.2); // 20% of rows
    let premiumEconomyRows = Math.floor(rows * 0.2); // 20% of rows
    let economyClassRows = rows - firstClassRows - businessClassRows - premiumEconomyRows;
  
    for (let row = 1; row <= rows; row++) {
      let seatClass;
      if (row <= firstClassRows) {
        seatClass = 'First';
      } else if (row <= firstClassRows + businessClassRows) {
        seatClass = 'Business';
      } else if (row <= firstClassRows + businessClassRows + premiumEconomyRows) {
        seatClass = 'Premium Economy';
      } else {
        seatClass = 'Economy';
      }
  
      for (let seat of seatLayout) {
        seatMap.push({
          seatNumber: `${row}${seat}`,
          isBooked: false, // Will be updated based on booked seats
          class: seatClass,
          type:
            seat === seatLayout[0] || seat === seatLayout[seatLayout.length - 1]
              ? 'Window'
              : seat === seatLayout[Math.floor(seatLayout.length / 2) - 1] ||
                seat === seatLayout[Math.floor(seatLayout.length / 2)]
              ? 'Aisle'
              : 'Middle',
        });
      }
    }
  
    return seatMap;
  };
  
  module.exports = { generateSeatMap };
  