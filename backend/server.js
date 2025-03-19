import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import problemRoutes from "./routes/problemsRoutes.js"; // ✅ Correct import
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Use Express built-in body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// ✅ Serve static files (for profile photos)
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/problems", problemRoutes); // ✅ This is correct

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Debugging environment variables
console.log("✅ Loaded MONGO_URI:", process.env.MONGO_URI ? "Exists" : "Not Found");
console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET ? "Exists" : "Not Found");
