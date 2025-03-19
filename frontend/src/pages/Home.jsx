import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-white bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <h1 className="text-5xl font-bold">Collaborate. Solve. Innovate.</h1>
        <p className="text-lg mt-4">Join a global community of problem solvers.</p>
        <Link to="/signup" className="mt-6 inline-block bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-200 transition">
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-800 rounded-lg text-center">
          <h3 className="text-xl font-semibold">Post & Categorize Problems</h3>
          <p className="mt-2">Share real-world problems and find solutions.</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg text-center">
          <h3 className="text-xl font-semibold">Vote for the Best Solutions</h3>
          <p className="mt-2">Upvote or downvote solutions to find the best ones.</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg text-center">
          <h3 className="text-xl font-semibold">Earn Rewards</h3>
          <p className="mt-2">Gain reputation points and badges for contributions.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold">Ready to start solving problems?</h2>
        <Link to="/signup" className="mt-4 inline-block bg-indigo-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-600 transition">
          Join Now
        </Link>
      </div>
    </div>
  );
}
