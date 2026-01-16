/*import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  recruiterStore  from '../../store/recruiterStore';
const Logout = () => {
  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BACKEND_URL
  const logout = recruiterStore((state) => state.logout);
  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch(backend_url+'/recruiters/logout', {
          method: 'POST', // Or GET if your backend handles it that way
          credentials: 'include', // Important for sending cookies
        });so

        if (response.ok) {
            toast.success("Recruiter Logged Out Successfully");
          navigate('/recruiters/login');
        } else {
          const data = await response.json();
          toast.error(data.message || "Logout failed");
        }
      } catch (error) {
        toast.error("Something went wrong while logging out.");
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <p className="text-lg text-gray-800">Logging you out...</p>
      <ToastContainer />
    </div>
  );
};

export default Logout;
*/

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import recruiterStore from '../../store/recruiterStore';

const Logout = () => {
  const navigate = useNavigate();
  // We use the function you defined in recruiterStore.js
  const logout = recruiterStore((state) => state.logout);

  useEffect(() => {
    const logoutUser = async () => {
      // 1. Call the store's logout (it handles the API and clears state)
      const result = await logout(); 

      // 2. Check if the store says "success"
      if (result?.success) {
        toast.success("Recruiter Logged Out Successfully");
        navigate('/recruiters/login');
      } else {
        // If API fails, we still navigate to login to be safe
        navigate('/recruiters/login');
      }
    };

    logoutUser();
  }, [logout, navigate]);

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F9D08] mx-auto mb-4"></div>
        <p className="text-lg text-gray-800">Logging you out...</p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Logout;