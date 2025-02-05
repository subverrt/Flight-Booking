// config/apiKeys.js
require('dotenv').config();

module.exports = {
  amadeusApiKey: process.env.AMADEUS_API_KEY,
  amadeusApiSecret: process.env.AMADEUS_API_SECRET,
};
