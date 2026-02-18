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
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  // 1. LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      setToken(data.token);
      setUser(data);
      
      return { success: true, role: data.role };
    } catch (error) {
      console.error("Login Failed:", error.response?.data?.message);
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  // 2. REGISTER FUNCTION (The New Addition)
  const register = async (firstName, lastName, email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/users`, {
        firstName,
        lastName,
        email,
        password
      });
      
      // Auto-login after register
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

  // 3. LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    window.location.href = '/login'; 
  };

  // 4. RETURN (Must be at the bottom, after all functions are defined)
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);