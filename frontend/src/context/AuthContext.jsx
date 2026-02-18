import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Configure Axios to always send token if we have it
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    // On load, check if we have a user stored
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    try {
const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password });
      
      // Save to Storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Update State
      setToken(data.token);
      setUser(data);
      
      return { success: true, role: data.role }; // Return role for redirection
    } catch (error) {
      console.error("Login Failed:", error.response?.data?.message);
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  // REGISTER FUNCTION 
  const register = async (firstName, lastName, email, password) => {
    try {
      // POST to /api/users (Standard REST endpoint for creation)
      const { data } = await axios.post(`${API_URL}/api/users`, {
        firstName,
        lastName,
        email,
        password
      });
      
      // If backend sends token immediately (Auto-Login), save it
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Registration Failed:", error.response?.data?.message);
      return { success: false, error: error.response?.data?.message || "Registration failed" };
    }
  };

  // ... Update the return statement to include register ...
  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    window.location.href = '/login'; // Hard refresh to clear state
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);