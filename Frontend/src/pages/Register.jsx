import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useUserStore from '../store/userStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
const Register = () => {
  const navigate = useNavigate();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { register } = useUserStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const loginRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const sidebarVariants = {
        hidden: { x: "100%",opacity: 0 },
        visible: { x: 0, transition: { duration: 0.4, ease: "easeInOut" }, opacity: 1 },
        exit: { x: "100%", transition: { duration: 0.3, ease: "easeInOut" } }
      };
  const handleSubmit = async (e) => {
  e.preventDefault();

  const firstName = firstNameRef.current.value.trim();
  const lastName = lastNameRef.current.value.trim();
  const email = emailRef.current.value.trim();
  const password = passwordRef.current.value;
  const confirmPassword = confirmPasswordRef.current.value;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    toast.error("Please fill in all fields");
    return;
  }

  if (firstName.length < 3 || lastName.length < 3) {
    toast.error("Full name must be at least 3 characters long");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  // Password strength checks
  const capitalRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  if (!capitalRegex.test(password)) {
    toast.error("Password must contain at least one uppercase letter");
    return;
  }

  if (!numberRegex.test(password)) {
    toast.error("Password must contain at least one number");
    return;
  }

  if (!specialCharRegex.test(password)) {
    toast.error("Password must contain at least one special character");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords don't match!");
    return;
  }

  const name = `${firstName} ${lastName}`;
  console.log(name);

  const result = await register({ name, email, password });
  if (result?.success) {
    navigate('/users/login');
  } else {
    toast.error(result.message || "Registration failed");
  }
};


   return (
      <>
        {/* Navbar */}
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
            <div className="hidden md:flex items-center gap-4 relative" ref={loginRef}>
              {/* Dropdown Login */}
              <button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="hover:text-[#4CAF50] font-medium flex items-center gap-1"
              >
                Login ▾
              </button>
  
              {isLoginOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
                  <Link
                    to="/users/login"
                    onClick={() => setIsLoginOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Job Seeker Login
                  </Link>
                  <Link
                    to="/recruiters/login"
                    onClick={() => setIsLoginOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Recruiter Login
                  </Link>
                </div>
              )}
  
              <Link
                to="/recruiters/register"
                className="bg-[#5F9D08] text-white px-5 py-2 rounded-md font-semibold hover:bg-[#45a049] transition shadow-md"
              >
                Post a Job
              </Link>
            </div>
  
            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1 focus:outline-none"
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="w-6 h-0.5 bg-gray-800"></span>
              <span className="w-6 h-0.5 bg-gray-800"></span>
              <span className="w-6 h-0.5 bg-gray-800"></span>
            </button>
          </nav>
        </header>
  
        {/* Sidebar for Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.aside
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              className="absolute top-0 right-0 min-w-1/4 bg-white rounded-xl shadow-2xl z-50 p-8 flex flex-col"
            >
              {/* Close Button */}
              <button
                className="self-end text-2xl mb-8 text-gray-600 hover:text-[#4CAF50]"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕
              </button>
  
              {/* Nav Links */}
              <ul className="flex flex-col gap-6 text-lg font-medium text-gray-700">
                <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                <li><Link to="/subscription" onClick={() => setIsMenuOpen(false)}>Plans</Link></li>
                <li><Link to="/support" onClick={() => setIsMenuOpen(false)}>Support</Link></li>
  
                {/* Mobile Login Dropdown */}
                <li>
                  <details className="group">
                    <summary className="cursor-pointer list-none hover:text-[#4CAF50]">
                      Login ▾
                    </summary>
                    <ul className="mt-2 bg-white shadow-lg rounded-md border overflow-hidden">
                      <li>
                        <Link
                          to="/users/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                        >
                          Job Seeker Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/recruiters/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                        >
                          Recruiter Login
                        </Link>
                      </li>
                    </ul>
                  </details>
                </li>
  
                <li>
                  <Link
                    to="/recruiters/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-[#5F9D08] text-white px-4 py-2 rounded-md shadow hover:bg-[#45a049] transition"
                  >
                    Post a Job
                  </Link>
                </li>
              </ul>
            </motion.aside>
          )}
        </AnimatePresence>
    <div className="flex min-h-screen bg-gradient-to-r from-gray-200 to-gray-50 justify-center items-center">
      <div className="relative flex flex-col lg:flex-row w-[90%] max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row w-[90%] mx-auto bg-white border-2-gray rounded shadow-xl min-h-[600px] justify-start">

          {/* Left green section */}
          <div className="lg:w-1/5 w-full bg-[#5F9D08] text-white flex items-center justify-center py-6 lg:py-0">
            <div className="text-center w-full px-4 py-2 md:py-0">
              <h3 className="text-xl font-semibold mb-0 md:mb-4">Join Us</h3>
              <p className="text-sm text-gray-100 hidden md:block">Start your career journey now</p>
            </div>
          </div>

          {/* Right form section */}
          <div className="w-full lg:w-5/6 p-10 max-w-md mx-auto space-y-6 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-[#5F9D08] mb-8 text-center transform transition-all duration-500 hover:scale-105">
              Sign Up
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-4 w-full">
                <label className="block text-gray-700 mb-2 text-left">First Name</label>
                <input
                  type="text"
                  ref={firstNameRef}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5F9D08]"
                  required
                />
              </div>
              <div className="mb-4 w-full">
                <label className="block text-gray-700 mb-2 text-left">Last Name</label>
                <input
                  type="text"
                  ref={lastNameRef}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5F9D08]"
                  required
                />
              </div>

              <div className="mb-4 w-full">
                <label className="block text-gray-700 mb-2 text-left">Email</label>
                <input
                  type="email"
                  ref={emailRef}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5F9D08]"
                  required
                />
              </div>

              {/* Password Field with eye */}
              <div className="mb-4 w-full">
                <label className="block text-gray-700 mb-2 text-left">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    ref={passwordRef}
                    className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5F9D08]"
                    required
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {showPassword ?  <FaEye />:<FaEyeSlash /> }
                  </span>
                </div>
              </div>

              {/* Confirm Password Field with eye */}
              <div className="mb-6 w-full">
                <label className="block text-gray-700 mb-2 text-left">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    ref={confirmPasswordRef}
                    className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5F9D08]"
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {showConfirmPassword ? <FaEye />:<FaEyeSlash />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5F9D08] text-white py-3 px-4 rounded-lg hover:bg-gradient-to-r from-[#5F9D08] to-[#4a7c06] transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Register
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/users/login" className="text-[#5F9D08] font-semibold hover:underline hover:text-[#00b398] transition-colors">
                  Login
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

export default Register;
