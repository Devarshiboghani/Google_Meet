import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios default
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get(`${backendUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
        } catch (error) {
          console.error("Failed to fetch user context", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [backendUrl]);

  const login = async (email, password) => {
    const res = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    }
    return false;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
