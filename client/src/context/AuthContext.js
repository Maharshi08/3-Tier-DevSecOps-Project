// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from '../axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email); // Debug log
      const res = await axios.post('/auth/login', { email, password });
      console.log('Login response:', res.data); // Debug log
      
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      } else {
        console.error('Invalid response format:', res.data);
        return {
          success: false,
          message: 'Invalid server response',
        };
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Registration attempt:', { username, email });
      const response = await axios.post('/auth/register', { 
        username, 
        email, 
        password 
      });
      console.log('Registration response:', response.data);
      return { 
        success: true,
        message: 'Registration successful! Please login.'
      };
    } catch (err) {
      console.error('Registration error:', err.response?.data || err);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
