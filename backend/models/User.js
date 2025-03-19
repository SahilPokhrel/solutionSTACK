import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    password: { type: String },
    otp: { type: String }, // For phone authentication
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
