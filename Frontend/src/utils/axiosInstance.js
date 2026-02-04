import axios from 'axios';

// Ensure the production URL is clean in Vercel settings
const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
    baseURL: `${base}/api`, 
    withCredentials: true, // Allows cross-site session cookies
});