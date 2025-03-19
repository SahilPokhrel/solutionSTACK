import Profile from "../models/Profile.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

// Create or update profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const { userId, fullName, username, bio, profession, skills, location, socialLinks, profilePhoto } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profilePhotoPath = null;

    // Handle Base64 image if provided
    if (profilePhoto && profilePhoto.startsWith("data:image")) {
      const matches = profilePhoto.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ success: false, message: "Invalid profile photo format" });
      }

      const ext = matches[1]; // jpg, png, etc.
      const base64Data = matches[2];
      const fileName = `profile_${userId}.${ext}`;
      const uploadPath = path.join("uploads", fileName);

      // Save the Base64 image as a file
      fs.writeFileSync(uploadPath, Buffer.from(base64Data, "base64"));
      profilePhotoPath = `/uploads/${fileName}`;
    }

    // If a file is uploaded via Multer, use that instead
    if (req.file) {
      profilePhotoPath = `/uploads/${req.file.filename}`;
    }

    // Find existing profile
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Update profile
      profile.fullName = fullName || profile.fullName;
      profile.username = username || profile.username;
      profile.bio = bio || profile.bio;
      profile.profession = profession || profile.profession;
      profile.skills = skills ? JSON.parse(skills) : profile.skills;
      profile.location = location || profile.location;
      profile.socialLinks = socialLinks ? JSON.parse(socialLinks) : profile.socialLinks;
      if (profilePhotoPath) profile.profilePhoto = profilePhotoPath; // Update only if a new image is uploaded

      await profile.save();
      return res.status(200).json({ success: true, message: "Profile updated successfully", profile });
    } else {
      // Create new profile
      profile = new Profile({
        userId,
        fullName,
        username,
        bio,
        profession,
        skills: skills ? JSON.parse(skills) : [],
        location,
        socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
        profilePhoto: profilePhotoPath,
      });

      await profile.save();
      return res.status(201).json({ success: true, message: "Profile created successfully", profile });
    }
  } catch (error) {
    console.error("❌ Error creating/updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { createOrUpdateProfile };
