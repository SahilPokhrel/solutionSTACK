import express from "express";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Fetch user profile
router.get("/me", async (req, res) => {
  try {
    console.log("🔍 Received Profile Fetch Request");

    // Extract and verify token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ success: false, message: "No token provided" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const userId = decodedToken.userId;

    // Fetch the profile from MongoDB
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    console.log("✅ Profile Fetched Successfully:", profile);
    console.log("🖼 Profile Photo Path:", profile.profilePhoto);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("❌ Error fetching profile:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ✅ Profile update route
router.post("/update", async (req, res) => {
  try {
    console.log("✅ Received Profile Update Request");
    console.log("🔍 Received Profile Data:", req.body); // Debugging step
    console.log("🖼 Received Profile Photo:", req.body.profilePhoto);


    // Extract and verify token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ success: false, message: "No token provided" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const userId = decodedToken.userId;

    // Extract profile data
    const { fullName, username, bio, profession, skills, location, socialLinks } = req.body;

    console.log("📌 Extracted Data:", { fullName, username, bio, profession, skills, location, socialLinks });

    // Ensure `skills` is an array
    const skillsArray = Array.isArray(skills) ? skills : skills?.split(",").map(skill => skill.trim());

    // Ensure `socialLinks` is a valid object
    let parsedSocialLinks = {};
    if (socialLinks) {
      try {
        parsedSocialLinks = typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;
        if (typeof parsedSocialLinks !== "object" || Array.isArray(parsedSocialLinks)) {
          throw new Error("Invalid socialLinks format");
        }
      } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid socialLinks format" });
      }
    }

    // Update profile in MongoDB
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { 
        $set: {  // Ensure fields are being set correctly
          fullName, 
          username, 
          bio, 
          profession, 
          skills: skillsArray, 
          location, 
          socialLinks: parsedSocialLinks 
        }
      },
      { new: true, upsert: true }
    );

    if (!profile) {
      return res.status(400).json({ success: false, message: "Profile update failed" });
    }

    console.log("✅ Profile Updated Successfully:", profile);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
