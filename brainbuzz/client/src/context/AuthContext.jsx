import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("bb_token") || null);
  const [theme, setTheme] = useState(localStorage.getItem("bb_theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bb_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const saved = localStorage.getItem("bb_user");
      if (saved) setUser(JSON.parse(saved));
    }
  }, [token]);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("bb_token", jwt);
    localStorage.setItem("bb_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bb_token");
    localStorage.removeItem("bb_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("bb_user", JSON.stringify(updated));
  };

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <AuthContext.Provider value={{ user, token, theme, login, logout, updateUser, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
