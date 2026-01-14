import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserStore from "../store/userStore.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password length check
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    const result = await login({ email, password });

    if (result.success) {
      navigate("/users/dashboard");
    } else {
      toast.error(result.message || "Login failed");
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
            <Link to="/recruiters/login" className="hover:text-[#4CAF50] font-medium">Recruiter Login</Link>
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

      <div className="flex min-h-screen bg-gradient-to-r from-gray-100 to-gray-50 justify-center items-center">
        <div className="relative flex w-full max-w-7xl">
          <div className="w-full bg-white rounded-2xl shadow-xl min-h-[600px] flex items-center justify-center">
            <div className="hidden lg:flex w-1/4 bg-[#5F9D08] text-white items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Welcome Back</h3>
                <p className="text-sm text-gray-300">Find your dream job today</p>
              </div>
            </div>

            <div className="w-full lg:w-3/4 p-10 max-w-md mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-[#5F9D08] mb-8 text-center">User Login</h2>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="mb-4 w-full">
                  <label className="block text-gray-700 mb-2 text-left">Email</label>
                  <input
                    type="email"
                    ref={emailRef}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5F9D08]"
                    required
                  />
                </div>

                <div className="mb-6 w-full">
                  <label className="block text-gray-700 mb-2 text-left">Password</label>
                  <div className="relative flex flex-row">
                    <input
                      type={showPassword ? "text" : "password"}
                      ref={passwordRef}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5F9D08]"
                      required
                    />
                    <span
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
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

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/users/register" className="text-[#5F9D08] font-semibold hover:underline hover:text-[#0041b3] transition-colors">
                    Register
                  </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <Link to="/users/change-password" className="text-[#5F9D08] font-semibold hover:underline hover:text-[#0041b3] transition-colors">
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

export default Login;
