import { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success && data.profile.profilePhoto) {
        setProfilePhoto(`http://localhost:5000${data.profile.profilePhoto}`);
        setProfileExists(true);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profilePhoto, profileExists, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
