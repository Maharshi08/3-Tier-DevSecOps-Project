// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',  // Using direct URL for now
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor
instance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error('Response error:', error.response?.data || error.message);
  return Promise.reject(error);
});

export default instance;
