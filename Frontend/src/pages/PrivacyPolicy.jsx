import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sidebar motion
  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main>
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="flex justify-between items-center py-4 px-8 md:px-16">
          <div className="text-2xl font-bold text-[#4CAF50]"><Link to="/" className="hover:text-[#4CAF50]">JobPortal</Link></div>

          <ul className="hidden md:flex gap-8 text-gray-700 font-medium flex-1 justify-center">
            <li><Link to="/" className="hover:text-[#4CAF50]">Home</Link></li>
            <li><Link to="/about" className="hover:text-[#4CAF50]">About</Link></li>
            <li><Link to="/subscription" className="hover:text-[#4CAF50]">Plans</Link></li>
            <li><Link to="/support" className="hover:text-[#4CAF50]">Support</Link></li>
          </ul>

          <div className="hidden md:flex items-center gap-4">
                      <Link to="/users/login" className="hover:text-[#4CAF50] font-medium">Login</Link>
                      <Link
                        to="/recruiters/register"
                        className="bg-[#5F9D08] text-white px-5 py-2 rounded-md font-semibold hover:bg-[#45a049] transition shadow-md"
                      >
                        Post a Job
                      </Link>
                    </div>
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
      <AnimatePresence>
        {isMenuOpen && (
          <motion.aside
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            className="absolute top-0 right-0  min-w-1/4  bg-white rounded-xl shadow-2xl z-50 p-8 flex flex-col"
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
              <li><Link to="/users/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
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

      {/* Hero */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#e0ffe0] to-[#c0f0c0] text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-800 drop-shadow-lg mb-6"
        >
          Privacy <span className="text-[#4CAF50]">Policy</span>
        </motion.h1>
        <motion.p 
        variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          We respect your privacy and are committed to protecting your personal data.  
          Learn how we collect, use, and safeguard your information while using our Job Portal.
        </motion.p>
      </section>

      {/* Main Policy Content */}
      <motion.div
        className="max-w-4xl mx-auto p-10 mt-12 bg-white shadow-xl rounded-2xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔐 Data We Collect</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6 leading-relaxed">
          <li>Account details (name, email, password)</li>
          <li>Profile information (resume, skills, work experience)</li>
          <li>Job applications and hiring workflow status</li>
          <li>Recruiter company details</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 How We Use Your Data</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6 leading-relaxed">
          <li>To provide job recommendations</li>
          <li>To keep candidates updated about application status</li>
          <li>To enable recruiters to manage hiring workflows</li>
          <li>To improve platform security & performance</li>
        </ul>

        <p className="text-gray-600 mb-8">
          We never sell your personal data. Your information is used strictly for
          enhancing your experience on our platform.
        </p>

        <Link
          to="/"
          className="inline-block bg-[#5F9D08] text-white px-6 py-3 rounded-lg shadow hover:bg-[#45a049] transition"
        >
          Back to Home
        </Link>
      </motion.div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-center text-white relative mt-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg"
        >
          Your Privacy, Our Priority
        </motion.h2>
        <motion.p 
        variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
        className="text-lg mb-8 opacity-90">
          We are committed to building a safe and transparent career platform.
        </motion.p>
        <motion.a
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          href="/support"
          className="px-8 py-4 bg-white text-[#4CAF50] font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-100 transition"
        >
          Need Support?
        </motion.a>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
