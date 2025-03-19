import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI); // Log URI to check if it's loaded correctly

    const conn = await mongoose.connect(process.env.MONGO_URI); // ✅ Removed deprecated options
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;
