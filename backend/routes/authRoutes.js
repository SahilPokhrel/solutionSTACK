import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ **Signup Route (Email or Phone)**
router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({ message: "Email or phone number is required." });
        }

        let existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or phone number." });
        }

        let newUser;
        if (phoneNumber) {
            const otp = generateOTP();
            console.log(`OTP for ${phoneNumber}: ${otp}`); // Replace with actual SMS API

            newUser = new User({ fullName, phoneNumber, otp, isVerified: false });
            await newUser.save();

            return res.status(201).json({ message: "OTP sent to phone. Verify your account.", phoneNumber });
        }

        if (email) {
            const hashedPassword = await bcrypt.hash(password, 10);
            newUser = new User({ fullName, email, password: hashedPassword });
            await newUser.save();
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(201).json({ 
            message: "User registered successfully", 
            token,
            user: { _id: newUser._id, fullName: newUser.fullName, email: newUser.email, phoneNumber: newUser.phoneNumber }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ **Login Route (Email/Password or Phone/OTP)**
router.post("/login", async (req, res) => {
    try {
        const { email, phoneNumber, password, otp } = req.body;

        let user;
        if (email) {
            user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: "Invalid email or password." });
            }
        } else if (phoneNumber) {
            user = await User.findOne({ phoneNumber });
            if (!user || user.otp !== otp) {
                return res.status(400).json({ message: "Invalid OTP." });
            }
            // ✅ Mark phone number as verified after OTP login
            user.isVerified = true;
            await user.save();
        } else {
            return res.status(400).json({ message: "Provide email or phone number." });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: { _id: user._id, fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;