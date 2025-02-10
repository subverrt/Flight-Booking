// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.use('/api/auth', authRoutes);
    app.use('/api/flights', flightRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/users', userRoutes);
    console.log('Routes have been registered.');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
