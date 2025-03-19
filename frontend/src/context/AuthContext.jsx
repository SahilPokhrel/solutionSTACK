import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem("profilePhoto") || "");
  const [profileExists, setProfileExists] = useState(localStorage.getItem("profileExists") === "true");

  // Sync state with localStorage when values change
  useEffect(() => {
    const updateAuthState = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setProfileExists(localStorage.getItem("profileExists") === "true");
      setProfilePhoto(localStorage.getItem("profilePhoto") || "");
    };

    updateAuthState();

    window.addEventListener("storage", updateAuthState);
    return () => window.removeEventListener("storage", updateAuthState);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profilePhoto");
    localStorage.removeItem("profileExists");
    setIsAuthenticated(false);
    setProfilePhoto("");
    setProfileExists(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, profileExists, profilePhoto, setProfileExists, setProfilePhoto, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
