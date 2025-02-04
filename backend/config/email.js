const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' }); // Path to .env file

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('✖️ Email server connection failed:', error);
  } else {
    console.log('✓ Email server connected');
  }
});

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Flight Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Flight Booking Verification</h2>
          <p>Your one-time password (OTP) is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #2563eb;">
            ${otp}
          </div>
          <p style="color: #6b7280; margin-top: 20px;">
            This code expires in 5 minutes.
          </p>
        </div>
      `
    });
    console.log(`✓ OTP sent to ${email}`);
  } catch (error) {
    console.error('✖️ Email send failed:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOTPEmail };
