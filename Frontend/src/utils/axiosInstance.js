import axios from 'axios';

// Ensure the production URL is clean in Vercel settings
const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
    baseURL: `${base}/api`, 
    withCredentials: true, // Allows cross-site session cookies
});
// Add an Interceptor to attach the token from LocalStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});