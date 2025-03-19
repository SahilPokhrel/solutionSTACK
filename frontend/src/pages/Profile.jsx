import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ProfileSetup() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    profilePhoto: "",
    fullName: "",
    username: "",
    bio: "",
    profession: "",
    skills: [],
    location: "",
    socialLinks: {  
      linkedin: "",
      github: "",
      twitter: "",
    },
  });

  const [usernameError, setUsernameError] = useState("");

  const skillsOptions = [
    "JavaScript", "React", "Node.js", "Python", "Django", "Flask", "Java", "Spring Boot",
    "C++", "C#", "Ruby on Rails", "Go", "Swift", "Kotlin", "Android Development",
    "iOS Development", "UI/UX Design", "Figma", "Adobe XD", "Product Management",
    "Data Science", "Machine Learning", "Deep Learning", "AI", "Cybersecurity",
    "DevOps", "Docker", "Kubernetes", "Cloud Computing", "AWS", "Azure",
    "Google Cloud", "Blockchain", "Solidity", "Smart Contracts", "SEO",
    "Digital Marketing", "Content Writing", "Copywriting", "Sales",
    "Project Management", "Business Analysis", "Entrepreneurship",
    "Networking", "Linux", "Embedded Systems", "IoT", "Game Development",
    "Ethical Hacking", "Penetration Testing", "Augmented Reality", "Virtual Reality"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    setProfileData((prevData) => {
      const updatedSkills = checked
        ? [...prevData.skills, value]  // Add skill if checked
        : prevData.skills.filter((skill) => skill !== value); // Remove skill if unchecked
      return { ...prevData, skills: updatedSkills };
    });
  };


  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      socialLinks: { ...profileData.socialLinks, [name]: value },
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    console.log("📸 Selected File:", file); // Debugging
  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("🖼 Base64 Encoded Image:", reader.result); // Debugging
        setProfileData((prevState) => ({
          ...prevState,
          profilePhoto: reader.result, // Preview
          profilePhotoFile: file, // Store the actual file
        }));
      };
      reader.readAsDataURL(file);
    }
  };



  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setProfileData({ ...profileData, username: value });
  };

  const handleUsernameBlur = () => {
    const usernameRegex = /^(?!.*[_.]{2})[a-zA-Z0-9._]{3,20}$/;
    if (!usernameRegex.test(profileData.username)) {
      setUsernameError("Username must be 3-20 characters, no spaces, and cannot start or end with '.' or '_'.");
    } else {
      setUsernameError("");
    }
  };
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [toast, setToast] = useState({ message: "", visible: false, type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  console.log("🚀 Submitting Profile Data...");
  console.log("📸 Stored Profile Photo File:", profileData.profilePhotoFile); // Debugging

  let profilePhotoBase64 = profileData.profilePhoto; // ✅ Get the already stored Base64 string

  if (!profilePhotoBase64 && profileData.profilePhotoFile) {
    try {
      console.log("📂 Reading profile photo file...");
      const reader = new FileReader();
      profilePhotoBase64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(profileData.profilePhotoFile);
      });
    } catch (error) {
      console.error("❌ Error reading image file:", error);
    }
  }

  let profileDataToSend = {
    fullName: profileData.fullName,
    username: profileData.username,
    bio: profileData.bio,
    profession: profileData.profession,
    location: profileData.location,
    socialLinks: profileData.socialLinks,
    skills: profileData.skills,
    profilePhoto: profilePhotoBase64 || "", // ✅ Ensure profilePhoto is sent!
  };

  console.log("🖼 Sending Profile Photo Data:", profileDataToSend.profilePhoto); // Debugging

  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    showToast("User is not authenticated. Please log in again.", "error");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(profileDataToSend),
    });

    const data = await response.json();
    console.log("🔹 Server Response:", data);

    if (data.success) {
      showToast("Profile updated successfully!", "success");
      if (data.profile.profilePhoto) {
        console.log("📸 Profile Photo URL:", data.profile.profilePhoto);
        localStorage.setItem("profilePhoto", data.profile.profilePhoto);
        localStorage.setItem("profileExists", "true");
        window.dispatchEvent(new Event("storage"));
      }

      setTimeout(() => {
        navigate("/myProfile");
      }, 2000);
    } else {
      showToast("Failed to update profile: " + data.message, "error");
    }
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    showToast("An error occurred while updating the profile.", "error");
  } finally {
    setLoading(false);
  }
};

  
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-400 text-center">Set Up Your Profile</h2>
        <form onSubmit={handleSubmit} className="mt-6">

          {/* Profile Photo Upload */}
          <div className="mb-4 flex flex-col items-center">
            <label className="block text-sm font-medium">Profile Photo</label>
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-600 mt-2">
              <img
                src={profileData.profilePhoto || "https://via.placeholder.com/96"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {toast.visible && (
            <div className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
              } animate-slide-in`}>
              {toast.message}
            </div>
          )}

          {/* Full Name (Required) */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Full Name *</label>
            <input type="text" name="fullName" value={profileData.fullName} onChange={handleChange} required className="w-full p-2 mt-1 bg-gray-700 border border-gray-600" />
          </div>

          {/* Username (Required) */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Username *</label>
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              required
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600"
            />
            {usernameError && <p className="text-red-400 text-sm mt-1">{usernameError}</p>}

          </div>

          {/* Bio (Optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Bio</label>
            <textarea name="bio" value={profileData.bio} onChange={handleChange} className="w-full p-2 mt-1 bg-gray-700 border border-gray-600"></textarea>
          </div>

          {/* Profession (Optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Profession</label>
            <input type="text" name="profession" value={profileData.profession} onChange={handleChange} className="w-full p-2 mt-1 bg-gray-700 border border-gray-600" />
          </div>

          {/* Select Multiple Skills */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Skills</label>
            <div className="border border-gray-600 bg-gray-700 p-2 mt-1 rounded-md h-32 overflow-y-auto">
              {skillsOptions.map((skill) => (
                <label key={skill} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={profileData.skills.includes(skill)}
                    onChange={handleSkillChange}
                    className="form-checkbox text-indigo-500"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>



          {/* Location (Optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Location</label>
            <input type="text" name="location" value={profileData.location} onChange={handleChange} className="w-full p-2 mt-1 bg-gray-700 border border-gray-600" />
          </div>

          {/* Social Links (Optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium">LinkedIn</label>
            <input type="url" name="linkedin" value={profileData.socialLinks.linkedin} onChange={handleSocialChange} className="w-full p-2 mt-1 bg-gray-700 border border-gray-600" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">GitHub</label>
            <input type="url" name="github" value={profileData.socialLinks.github} onChange={handleSocialChange} className="w-full p-2 mt-1 bg-gray-700 border border-gray-600" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Twitter</label>
            <input type="url" name="twitter" value={profileData.socialLinks.twitter} onChange={handleSocialChange} className="w-full p-2 mt-1 bg-gray-700 border border-gray-600" />
          </div>

          {/* Save Profile Button */}
          <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 transition p-2 rounded font-semibold mt-4">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
