import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { setProfileExists, setProfilePhoto } = useAuth(); // ✅ Use AuthContext

  const [signupMethod, setSignupMethod] = useState("email");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = () => {
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    setOtpSent(true);
    setError("");
    console.log("OTP sent to:", formData.phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("🔹 Signup API Response:", data);

      if (response.ok) {
        if (!data.token) {
          console.error("❌ Token missing in response!");
          return;
        }

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("profileExists", "true"); // ✅ Store profile status
        localStorage.setItem("profilePhoto", data.user.profilePhoto || ""); // ✅ Store profile photo

        // ✅ Update AuthContext
        setProfileExists(true);
        setProfilePhoto(data.user.profilePhoto || "");

        setSuccessMessage("Signup successful! Redirecting...");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Failed to connect to server.");
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-400 text-center">Create an Account</h2>

        {/* Display Success Message */}
        {successMessage && (
          <p className="text-green-400 text-sm mt-2 text-center">{successMessage}</p>
        )}

        {/* Display Error Message */}
        {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}

        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 rounded-l ${signupMethod === "email" ? "bg-indigo-500" : "bg-gray-600"}`}
            onClick={() => setSignupMethod("email")}
          >
            Email
          </button>
          <button
            className={`px-4 py-2 rounded-r ${signupMethod === "phone" ? "bg-indigo-500" : "bg-gray-600"}`}
            onClick={() => setSignupMethod("phone")}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {signupMethod === "email" ? (
            <>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </>
          ) : (
            <>
              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* OTP */}
              {otpSent ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium">Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition p-2 rounded font-semibold mt-4"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
