import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, profileExists, profilePhoto,} = useAuth();

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold text-indigo-400">SolutionSTACK</h1>

      <div className="space-x-6 flex items-center">
        <Link to="/" className="hover:text-indigo-300 transition">Home</Link>
        <Link to="/problems" className="hover:text-indigo-300 transition">Problems</Link>
        <Link to="/leaderboard" className="hover:text-indigo-300 transition">Leaderboard</Link>

        {isAuthenticated && profileExists ? (
          <div className="flex items-center space-x-4">
            <Link to="/myProfile">
              <img
                src={profilePhoto || "fallback-image.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-indigo-500"
              />

            </Link>
            {/* <button onClick={logout} className="text-red-400 hover:text-red-300 transition">
              Logout
            </button> */}
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-300 transition">Login</Link>
            <Link to="/signup" className="bg-indigo-500 px-4 py-2 rounded-md hover:bg-indigo-600 transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
