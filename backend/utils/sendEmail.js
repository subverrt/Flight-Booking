const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Flight Booking" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Login OTP',
    html: `<b>Your OTP is: ${otp}</b> (Valid for 5 minutes)`
  });
};