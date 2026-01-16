/*import axios from 'axios';

const backend_url = import.meta.env.VITE_BACKEND_URL
export const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8000/api',  // 👈 Ensure this matches your backend's base URL
  // baseURL: 'https://job-portal-backend-swtv.onrender.com/api', // ✅ Render backend URL
  baseURL: backend_url,  
  withCredentials: true,                 // 👈 Enables sending cookies (used for sessions/auth)
  headers: {
    'Content-Type': 'application/json',  // 👈 Default content type for requests
    // You can add more headers here if needed (like Authorization)
  },
});
 */
import axios from 'axios';

// This handles ALL cases: 
// 1. If VITE_BACKEND_URL is found in the future, it uses it.
// 2. Otherwise, it defaults to your local backend on port 8000.
const backend_url = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api` 
  : 'http://localhost:8000/api';

export const axiosInstance = axios.create({
  baseURL: backend_url,  
  withCredentials: true, // This allows the browser to store your login session
  headers: {
    'Content-Type': 'application/json',
  },
});