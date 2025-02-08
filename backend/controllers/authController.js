// backend/controllers/authController.js
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../config/email');
const generateOTP = require('../utils/generateOTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
  console.log("Received signup request:", req.body);

  try {
    let { name, email, password } = req.body;

    // Normalize email (convert to lowercase)
    if (email) {
      email = email.toLowerCase();
    }

    // Validate required fields
    if (!name || !email || !password) {
      console.log("Missing fields:", { name, email, password });
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user with isVerified initially false.
    // Do NOT manually hash the password here—let the pre('save') hook in User.js handle it.
    user = new User({ name, email, password, isVerified: false });
    await user.save();

    // Generate JWT Token (for immediate login or further steps)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Generate OTP and store it (valid for 5 minutes)
    const otp = generateOTP();
    // Remove any previous OTPs for this email
    await OTP.deleteMany({ email });
    const otpRecord = new OTP({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
    await otpRecord.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    console.log("User created successfully with ID:", user._id);
    res.status(201).json({ token, userId: user._id, message: "Signup successful, OTP sent to your email" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const normalizedEmail = email.toLowerCase();
    const otp = generateOTP();
    await OTP.deleteMany({ email: normalizedEmail });
    const otpRecord = new OTP({ email: normalizedEmail, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
    await otpRecord.save();
    await sendOTPEmail(normalizedEmail, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const normalizedEmail = email.toLowerCase();
    const otpRecord = await OTP.findOne({ email: normalizedEmail, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }
    // Mark the user as verified
    const user = await User.findOneAndUpdate({ email: normalizedEmail }, { isVerified: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Remove the OTP record after verification
    await OTP.deleteOne({ _id: otpRecord._id });
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("Login request received:", req.body);

    // Normalize email
    if (email) {
      email = email.toLowerCase();
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found for email:", email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("User found:", user._id, "isVerified:", user.isVerified);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", user._id);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      console.log("User not verified:", user._id);
      return res.status(401).json({ message: 'Please verify your email first' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log("Token:", token);
  if (!token) return res.status(401).json({ message: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
