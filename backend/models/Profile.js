import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  bio: { type: String },
  profession: { type: String },
  skills: { type: [String], default: [] },
  location: { type: String },
  socialLinks: { type: Map, of: String },
}, { timestamps: true });

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;
