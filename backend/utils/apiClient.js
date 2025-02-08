import axios from 'axios';
import { AMADEUS_API_KEY, AMADEUS_API_SECRET } from '../config/apiKeys.js';

// Create axios instance for Amadeus API
const amadeusClient = axios.create({
  baseURL: 'https://api.amadeus.com/v1',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// Add authentication interceptor
amadeusClient.interceptors.request.use(async (config) => {
  try {
    const authResponse = await axios.post('https://api.amadeus.com/v1/security/oauth2/token', 
      `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    config.headers.Authorization = `Bearer ${authResponse.data.access_token}`;
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

export default amadeusClient;