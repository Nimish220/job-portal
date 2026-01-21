import React, { useState } from 'react'
import {useNavigate, Link} from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useRecruiterStore from '../../store/recruiterStore.js'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
const RecruiterLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showpassword, setShowPassword] = useState(false);
    const { login } = useRecruiterStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const handleSubmit = async (e) => {  // jisne bhi phele likha tha bhai recruiterStore bhi dekh liya kr
      e.preventDefault();
      if (password.length < 6) {
          toast.error("Password must be at least 6 characters.");
          return;
        }

      const result = await login({ email, password });
      
        if (result.success) {
          navigate("/recruiters/jobs/active");
        } else {
          toast.error(result.message || "Login failed");
        }  
      
    };
  
    return (
<>
      <header className="bg-white shadow-md sticky top-0 z-50">
                  <nav className="flex justify-between items-center py-4 px-6 md:px-16">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-[#4CAF50]">JobPortal</div>
          
                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-8 text-gray-700 font-medium flex-1 justify-center">
                      <li><Link to="/" className="hover:text-[#4CAF50]">Home</Link></li>
                      <li><Link to="/about" className="hover:text-[#4CAF50]">About</Link></li>
                      <li><Link to="/subscription" className="hover:text-[#4CAF50]">Plans</Link></li>
                      <li><Link to="/support" className="hover:text-[#4CAF50]">Support</Link></li>
                    </ul>
          
                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">
                      <Link to="/users/login" className="hover:text-[#4CAF50] font-medium">Find Job</Link>
                      {/* <Link
                        to="/recruiters/register"
                        className="bg-[#4CAF50] text-white px-5 py-2 rounded-md font-semibold hover:bg-[#45a049] transition shadow-md"
                      >
                        Post a Job
                      </Link> */}
                    </div>
          
                    {/* Mobile Hamburger */}
                    <button
                      className="md:hidden flex flex-col gap-1 focus:outline-none"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <span className="w-6 h-0.5 bg-gray-800"></span>
                      <span className="w-6 h-0.5 bg-gray-800"></span>
                      <span className="w-6 h-0.5 bg-gray-800"></span>
                    </button>
                  </nav>
                </header>
      {/* Add this inside your return, right after the closing </header> tag */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col p-6 shadow-xl md:hidden"
    >
      <div className="flex justify-between items-center mb-10">
        <div className="text-2xl font-bold text-[#4CAF50]">JobPortal</div>
        {/* Close Button */}
        <button onClick={() => setIsMenuOpen(false)} className="text-3xl text-gray-800">
          &times;
        </button>
      </div>

      <ul className="flex flex-col gap-6 text-xl text-gray-700 font-medium">
        <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
        <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
        <li><Link to="/subscription" onClick={() => setIsMenuOpen(false)}>Plans</Link></li>
        <li><Link to="/support" onClick={() => setIsMenuOpen(false)}>Support</Link></li>
        <hr className="border-gray-100" />
        <li>
          <Link 
            to="/users/login" 
            className="text-[#4CAF50]"
            onClick={() => setIsMenuOpen(false)}
          >
            User Login
          </Link>
        </li>
        <li>
          <Link 
            to="/recruiters/login" 
            className="text-[#4CAF50]"
            onClick={() => setIsMenuOpen(false)}
          >
            Recruiter Login
          </Link>
        </li>
      </ul>
    </motion.div>
  )}
</AnimatePresence>
      <div className="flex min-h-screen bg-gradient-to-r from-gray-100 to-gray-50 justify-center items-center">
        <div className="relative flex w-full max-w-7xl">
          <div className="w-full bg-white rounded-2xl shadow-xl min-h-[600px] flex items-center justify-center">
            <div className="hidden lg:flex w-1/4 bg-[#5F9D08] text-white items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Welcome Back</h3>
                <p className="text-sm text-gray-300">Manage your job postings</p>
              </div>
            </div>
            <div className="w-full lg:w-3/4 p-10 max-w-md mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-[#5F9D08] mb-8 text-center">Recruiter Login</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="mb-4 w-full">
                  <label className="block text-gray-700 mb-2 text-left">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5F9D08]"
                    required
                  />
                </div>
                <div className="mb-6 w-full">
                  <label className="block text-gray-700 mb-2 text-left">Password</label>
                  <div className="relative flex flex-row">
                    <input
                    type={showpassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5F9D08]"
                    required
                  />
                    <span
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                                      >
                                                        {showpassword ?  <FaEye />:<FaEyeSlash /> }
                                                      </span>
                  </div>
                  
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#5F9D08] text-white py-3 px-4 rounded-lg hover:bg-[#0041b3] transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Login
                </button>
              </form>

              {/* Links for Registration and Forgot Password */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/recruiters/register" className="text-[#5F9D08] font-semibold hover:underline hover:text-[#0041b3] transition-colors">
                    Register
                  </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <Link to="/recruiters/change-password" className="text-[#5F9D08] font-semibold hover:underline hover:text-[#0041b3] transition-colors">
                    Forgot Password?
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-center" theme="colored" />
      </div>
      </>
    );
};

export default RecruiterLogin