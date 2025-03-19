import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-400">SolutionSTACK</h2>
          <p className="mt-2 text-sm">
            A collaborative platform where innovators come together to solve problems and create impactful solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><Link to="/" className="hover:text-indigo-300">Home</Link></li>
            <li><Link to="/problems" className="hover:text-indigo-300">Problems</Link></li>
            <li><Link to="/profile" className="hover:text-indigo-300">Profile</Link></li>
            <li><Link to="/login" className="hover:text-indigo-300">Login</Link></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-lg font-semibold text-white">Connect with Us</h3>
          <p className="mt-2 text-sm">Have a question? Reach out to us at:</p>
          <p className="text-indigo-400 font-semibold mt-1">contact@solutionstack.com</p>

          <div className="mt-4 flex space-x-4">
            <a href="#" className="hover:text-indigo-300">Twitter</a>
            <a href="#" className="hover:text-indigo-300">LinkedIn</a>
            <a href="#" className="hover:text-indigo-300">GitHub</a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm border-t border-gray-700 mt-6 pt-4">
        &copy; {new Date().getFullYear()} SolutionSTACK. All rights reserved.
      </div>
    </footer>
  );
}
