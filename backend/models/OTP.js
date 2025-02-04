const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 5*60*1000) // Correct dynamic date
  }
});

module.exports = mongoose.model('OTP', otpSchema);