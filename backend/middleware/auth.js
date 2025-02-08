// middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  console.log('Auth middleware hit');
  const authHeader = req.headers['authorization'];
  const token = req.headers.authorization?.split(' ')[1];

  console.log('Authorization Header:', authHeader);
  console.log('Token received:', token);

  
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};
