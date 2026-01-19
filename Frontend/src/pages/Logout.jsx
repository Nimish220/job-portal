import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUserStore from '../store/userStore.js'
const Logout = () => {
  const navigate = useNavigate();
  const {logout}=useUserStore()
  useEffect(() => {
    const logoutUser=async () => {
      const result=await logout()

      if(result.success){
        navigate('/') //navigates to landing page
      }
    }
    logoutUser();
  }, [navigate,logout]);

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <p className="text-lg text-gray-800">Logging you out...</p>
      <ToastContainer />
    </div>
  );
};

export default Logout;