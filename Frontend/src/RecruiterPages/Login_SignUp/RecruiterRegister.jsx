import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useRecruiterStore from '../../store/recruiterStore';
import { motion, AnimatePresence } from 'framer-motion';
const RecruiterRegister = () => {
  const navigate = useNavigate();
  const { register } = useRecruiterStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const loginRef = useRef(null);
  const formRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, transition: { duration: 0.4, ease: "easeInOut" }, opacity: 1 },
  exit: { x: "100%", transition: { duration: 0.3, ease: "easeInOut" } }
};


  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
    panCardOrGstFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleNext = () => {
  const { companyName, phone, password, confirmPassword } = formData;

  if (!companyName || !phone || !password || !confirmPassword) {
    toast.error("Please fill all required fields in Step 1.");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long.");
    return;
  }

  // Password strength checks
  const capitalRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  if (!capitalRegex.test(password)) {
    toast.error("Password must contain at least one uppercase letter.");
    return;
  }

  if (!numberRegex.test(password)) {
    toast.error("Password must contain at least one number.");
    return;
  }

  if (!specialCharRegex.test(password)) {
    toast.error("Password must contain at least one special character.");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  console.log("📁 File selected:", formData.panCardOrGstFile);
  console.log("📎 Is File?", formData.panCardOrGstFile instanceof File);

  setStep(2);
};



const handleSubmit = async (e) => {
  e.preventDefault();

  const { email, panCardOrGstFile } = formData;
  if (!email || !panCardOrGstFile) {
    toast.error("Please complete all fields in Step 2.");
    return;
  }

  const combinedFormData = new FormData();
  for (const key in formData) {
    if (key === "panCardOrGstFile") {
      combinedFormData.append("companyPanCardOrGstFile", formData.panCardOrGstFile); // important
    } else {
      combinedFormData.append(key, formData[key]);
    }
  }
  console.log("file selected:", formData.panCardOrGstFile);
console.log("isFile?", formData.panCardOrGstFile instanceof File);

  const result = await register(combinedFormData);
  if (result?.success) {
    navigate("/recruiters/login");
  } else {
    toast.error(result?.message || "Registration failed");
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
          <div className="hidden md:flex items-center gap-4">
                      
                      {/* STEP 1: Put 'relative' here so the dropdown anchors only to this button */}
                      <div className="relative" ref={loginRef}> 
                        <button
                          onClick={() => setIsLoginOpen(!isLoginOpen)}
                          className="hover:text-[#4CAF50] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          Login ▾
                        </button>
          
                        {isLoginOpen && (
                          /* STEP 2: Change 'right-0' to 'left-0' */
                          <div className="absolute left-0 top-full mt-4 w-52 bg-white shadow-2xl rounded-lg border border-black z-50 overflow-hidden">
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
                              className="block px-4 py-2 hover:bg-gray-100 text-gray-700 "
                            >
                              Recruiter Login
                            </Link>
                          </div>
                        )}
                      </div>
          
                      <Link
                        to="/users/login"
                        className="bg-[#5F9D08] text-white px-5 py-2 rounded-md font-semibold hover:bg-[#45a049] transition shadow-md"
                      >
                        Job Seeker Login
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
                   to="/users/register"
                   onClick={() => setIsMenuOpen(false)}
                   className="bg-[#5F9D08] text-white px-4 py-2 rounded-md shadow hover:bg-[#45a049] transition"
                 >
                   Job Seeker Register
                 </Link>
               </li>
             </ul>
           </motion.aside>
         )}
       </AnimatePresence>

    <div className="flex min-h-screen bg-gradient-to-r from-gray-200 to-gray-50 justify-center items-center px-4 py-16">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl min-h-[600px] bg-white shadow-xl rounded-lg overflow-hidden">
        
        
        <div className="lg:w-1/4 bg-[#5F9D08] text-white flex flex-col justify-center items-center py-8">
          <h3 className="text-xl font-semibold">Company Panel</h3>
          <p className="text-sm text-gray-200 mt-2 text-center px-4">Step {step} of 2</p>
        </div>

        
        <div className="w-full lg:w-3/4 p-10">
          <h2 className="text-2xl font-bold text-[#5F9D08] mb-6 text-center">Company Registration</h2>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 lg:px-32">

            {step === 1 && (
              <>
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Company Name<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="p-2 pr-10 border border-gray-300 rounded w-full"
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-500 cursor-pointer">
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Confirm Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="p-2 pr-10 border border-gray-300 rounded w-full"
                    />
                    <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2 text-gray-500 cursor-pointer">
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                </div>

                <button type="button" onClick={handleNext} className="bg-[#5F9D08] cursor-pointer text-white py-2 rounded hover:scale-105 transition-all duration-300 hover:bg-[#4e9d08]">Next</button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">Upload PAN Card or GST Document(PDF only)<span className="text-red-500">*</span></label>
                  <input
                    type="file"
                    name="panCardOrGstFile"
                    onChange={handleChange}
                    accept=".pdf"
                    required
                    className="p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>

                <div className="flex justify-between gap-20 mt-4">
                  <button type="button" onClick={() => setStep(1)} className="bg-gray-300 cursor-pointer text-black py-2 px-6 rounded hover:bg-gray-400 transition-all duration-300">Previous</button>
                  <button type="submit" className="bg-[#5F9D08] text-white cursor-pointer py-2 px-6 rounded hover:scale-105 transition-all duration-300 hover:bg-[#4e9d08] w-full">Register</button>
                </div>
              </>
            )}
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-700">
              Already have an account?{' '}
              <Link to="/recruiters/login" className="text-[#5F9D08] font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </div>
    </>
  );
};

export default RecruiterRegister;