import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineCheckCircle } from "react-icons/ai"; // ✅ Success icon
import { motion } from "framer-motion"; // ✅ Animations
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { setProfileExists, setProfilePhoto } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    otp: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // ✅ Show success popup

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Send OTP Function
  const sendOtp = async () => {
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { phoneNumber: formData.phoneNumber });
      setOtpSent(true);
      setError("");
      console.log("✅ OTP sent to:", formData.phoneNumber);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
      console.error("❌ OTP Error:", err);
    }
  };

  // ✅ Handle Login
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (loginMethod === "email" && (!formData.email || !formData.password)) {
    setError("Please enter both email and password.");
    return;
  }
  if (loginMethod === "phone" && (!otpSent || !/^\d{6}$/.test(formData.otp))) {
    setError("Enter a valid 6-digit OTP.");
    return;
  }

  console.log("🚀 Sending Login Request:", formData);

  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", formData);
    console.log("🔄 Server Response:", response.data);

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("profileExists", "true"); // ✅ Store profile status
      localStorage.setItem("profilePhoto", response.data.user.profilePhoto || "");

      // ✅ Update AuthContext
      setProfileExists(true);
      setProfilePhoto(response.data.user.profilePhoto || "");

      setUser(response.data.user);
      setShowPopup(true); // ✅ Show success popup

      // ✅ Auto-redirect after 1.5 sec
      setTimeout(() => {
        navigate("/myProfile");
      }, 1500);
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Try again.");
    console.error("❌ Login Error:", err);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-400 text-center">Login</h2>

        {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}

        {/* Toggle between Email and Phone Login */}
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 rounded-l ${loginMethod === "email" ? "bg-indigo-500" : "bg-gray-600"}`}
            onClick={() => setLoginMethod("email")}
          >
            Email
          </button>
          <button
            className={`px-4 py-2 rounded-r ${loginMethod === "phone" ? "bg-indigo-500" : "bg-gray-600"}`}
            onClick={() => setLoginMethod("phone")}
          >
            Phone
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          {loginMethod === "email" ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-3 text-gray-400 text-sm"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {otpSent ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium">Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 transition p-2 rounded font-semibold mt-4"
                >
                  Send OTP
                </button>
              )}
            </>
          )}

          <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 transition p-2 rounded font-semibold mt-4">
            Log In
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          <Link to="/forgot-password" className="text-indigo-400 hover:underline">
            Forgot Password?
          </Link>
        </p>
        <p className="text-center text-sm mt-2">
          Don't have an account?
          <Link to="/signup" className="text-indigo-400 hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      </div>

      {/* ✅ Success Popup */}
      {showPopup && user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-sm">
            <AiOutlineCheckCircle className="text-green-500 text-5xl mx-auto" />
            <h2 className="text-xl font-semibold mt-2">Login Successful!</h2>
            <p className="text-gray-600 mt-2">Welcome back, {user.fullName}!</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
