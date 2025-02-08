// config/apiKeys.js
require('dotenv').config();

module.exports = {
  amadeusApiKey: process.env.AMADEUS_CLIENT_ID,
  amadeusApiSecret: process.env.AMADEUS_CLIENT_SECRET,
};
