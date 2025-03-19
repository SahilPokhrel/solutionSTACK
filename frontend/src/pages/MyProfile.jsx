import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (data.success) {
          setProfile(data.profile);
        } else {
          navigate("/profile"); // Redirect to profile setup if no profile found
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("profilePhoto");
    localStorage.removeItem("profileExists");
    window.dispatchEvent(new Event("storage")); // Force navbar update
    navigate("/login");
  };


  if (loading) return <p className="text-center mt-10 text-gray-700">Loading profile...</p>;
  if (!profile) return <p className="text-center mt-10 text-gray-700">Profile not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img
            src={
              profile.profilePhoto
                ? `http://localhost:5000${profile.profilePhoto}`
                : "/default-avatar.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold">{profile.fullName}</h1>
            <p className="text-gray-600 text-lg">@{profile.username}</p>
            <p className="text-gray-500 text-sm">{profile.profession || "No profession listed"}</p>
          </div>
        </div>

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Profile Details */}
      <div className="mt-6 space-y-6">
        {/* Bio */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Bio</h2>
          <p className="text-gray-700">{profile.bio || "No bio available"}</p>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
          <p className="text-gray-700">
            {profile.skills?.length > 0 ? profile.skills.join(", ") : "No skills added"}
          </p>
        </div>

        {/* Location & Join Date */}
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Location</h2>
            <p className="text-gray-700">{profile.location || "Not provided"}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Member Since</h2>
            <p className="text-gray-700">{profile.joinDate ? new Date(profile.joinDate).toDateString() : "Unknown"}</p>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Social Links</h2>
          <ul className="flex space-x-6 text-indigo-500">
            {profile.socialLinks?.linkedin && (
              <li>
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  🔗 LinkedIn
                </a>
              </li>
            )}
            {profile.socialLinks?.github && (
              <li>
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  🐙 GitHub
                </a>
              </li>
            )}
            {profile.socialLinks?.twitter && (
              <li>
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  🐦 Twitter
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Problem-Solving Stats */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold text-gray-800">Problem-Solving Stats</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-semibold text-indigo-500">Problems Solved</h3>
              <p className="text-gray-700 text-lg">{profile.problemsSolved || 0}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-semibold text-indigo-500">Solutions Submitted</h3>
              <p className="text-gray-700 text-lg">{profile.solutionsSubmitted || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate("/profile")}
          className="px-5 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
