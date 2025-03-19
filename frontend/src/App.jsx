import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MyProfile from "./pages/MyProfile";


function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/myProfile" element={<MyProfile />} />
        </Routes>
      </div>
      <Footer /> 
    </Router>  
  );
}

export default App;
  