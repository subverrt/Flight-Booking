const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `Flight Booking <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Your OTP Code</h2>
        <p>Please use the following OTP to verify your email. This code will expire in 5 minutes.</p>
        <h1>${otp}</h1>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

exports.sendBookingConfirmationEmail = async (toEmail, booking) => {
  const mailOptions = {
    from: `Flight Booking <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Booking Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Booking Confirmation #${booking._id}</h2>
        <p>Your flight booking has been confirmed!</p>
        
        <h3>Flight Details:</h3>
        <p>${booking.flight.airline} ${booking.flight.flightNumber}</p>
        <p>${booking.flight.departureAirport} → ${booking.flight.arrivalAirport}</p>
        <p>Departure: ${new Date(booking.flight.departureTime).toLocaleString()}</p>
        
        <h3>Passenger Details:</h3>
        ${booking.passengers.map(p => `
          <div style="margin-bottom: 15px;">
            <p>Name: ${p.name}</p>
            <p>Seat: ${p.seat.seatNumber} (${p.seat.class})</p>
          </div>
        `).join('')}
        
        <p>Total Amount: ₹${booking.totalAmount}</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};