import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Register user
export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ message: "Email or Phone Number is required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, phoneNumber, password: hashedPassword });

    await newUser.save();

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 🔹 Debugging: Log token and user data
    console.log("✅ User Registered:", newUser);
    console.log("✅ Generated Token:", token);

    // ✅ Send token in response
    res.status(201).json({
      message: "User registered successfully.",
      token,  // ✅ Include token in response
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });

  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Login user
export const login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, message: "Login successful", token, user });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// Send OTP (Mock for now)
export const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: "Phone number required." });

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ message: "User not found." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(`OTP for ${phoneNumber}: ${otp}`); // Mock OTP sending
    res.json({ message: "OTP sent successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // ✅ Generate JWT token after successful OTP verification
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, message: "Phone number verified successfully.", token, user });
  } catch (err) {
    console.error("❌ OTP Verification Error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

