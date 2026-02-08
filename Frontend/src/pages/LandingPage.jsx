import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import landingImage from "../assets/images/landing_page.jpg";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const loginRef = useRef(null);

  // Close login dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setIsLoginOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Motion variants
  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, transition: { duration: 0.4, ease: "easeInOut" }, opacity: 1 },
    exit: { x: "100%", transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
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

      <main>
        {/* Hero */}
        <section className="flex flex-col md:flex-row items-center justify-between py-20 md:py-24 px-6 md:px-20 bg-gradient-to-b from-[#e0ffe0] to-[#c0f0c0]">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-6 drop-shadow-lg">
              Find Your <span className="text-[#4CAF50]">Dream Job</span> Today!
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl leading-relaxed mx-auto md:mx-0">
              A modern career platform connecting job seekers and recruiters with
              efficiency, transparency, and trust.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/users/register">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="py-3 px-6 rounded-md text-base sm:text-lg font-semibold bg-[#5F9D08] text-white shadow-lg hover:shadow-xl hover:bg-[#45a049] transition-transform"
                >
                  I’m a Job Seeker
                </motion.button>
              </Link>
              <Link to="/recruiters/register">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="py-3 px-6 rounded-md text-base sm:text-lg font-semibold border-2 border-[#5F9D08] text-[#5F9D08] bg-white shadow-lg hover:bg-[#5F9D08] hover:text-white transition-transform"
                >
                  I’m a Recruiter
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <img
              src={landingImage}
              alt="Job Portal Illustration"
              className="max-w-full h-auto rounded-lg shadow-2xl"
            />
          </motion.div>
        </section>

        {/* ... keep rest of your sections same (How It Works, Features, Stats, Testimonials, CTA, Footer) ... */}
        <section className="bg-white py-20 px-6 md:px-20 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-800 mb-16"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Sign Up", desc: "Register as a job seeker or recruiter in just a few steps." },
              { step: "2", title: "Explore", desc: "Job seekers browse jobs, recruiters explore candidates." },
              { step: "3", title: "Connect", desc: "Apply, shortlist, and hire with one simple platform." },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition relative overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#5F9D08]/10 rounded-full blur-2xl"></div>
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#5F9D08] text-white text-xl font-bold rounded-full shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 md:px-20 bg-gray-50">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Features for Everyone
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "For Job Seekers",
                features: [
                  "✔ Save jobs for later",
                  "✔ Track applied jobs & statuses",
                  "✔ Get company insights",
                  "✔ Build your professional profile"
                ]
              },
              {
                title: "For Recruiters",
                features: [
                  "✔ Post jobs quickly",
                  "✔ Manage candidates effortlessly",
                  "✔ Shortlist, reject, or accept instantly",
                  "✔ Advanced analytics & insights"
                ]
              }
            ].map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#4CAF50]/5 to-transparent pointer-events-none"></div>
                <h3 className="text-2xl font-bold text-[#4CAF50] mb-6">{section.title}</h3>
                <ul className="text-gray-600 space-y-3 text-left">
                  {section.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#4CAF50] text-lg">•</span> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white py-20 px-6 md:px-20">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Our Impact
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { value: "500K+", label: "Active Job Seekers" },
              { value: "50K+", label: "Recruiters" },
              { value: "1M+", label: "Jobs Posted" },
              { value: "95%", label: "Success Rate" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -5 }}
                className="p-10 bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition"
              >
                <h3 className="text-4xl font-extrabold text-[#4CAF50] drop-shadow-md">{stat.value}</h3>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 md:px-20 bg-gray-50">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center text-gray-800 mb-16"
          >
            What Our Users Say
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: "Sarah M.", role: "Job Seeker", feedback: "I found my dream job in just 2 weeks. The application tracking made it so easy!" },
              { name: "David K.", role: "Recruiter", feedback: "The candidate management tools streamlined our hiring process." },
              { name: "Lisa P.", role: "Designer", feedback: "I love how clean the UI is – applying for jobs has never been this smooth." },
            ].map((user, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition relative"
              >
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#5F9D08]/10 rounded-full blur-2xl"></div>
                <p className="text-gray-600 italic">"{user.feedback}"</p>
                <h3 className="mt-6 font-semibold text-[#5F9D08]">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-r from-[#5F9D08] to-[#45a049] text-center text-white relative overflow-hidden">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold mb-6 drop-shadow-lg"
          >
            Ready to Take the Next Step?
          </motion.h2>
          <p className="text-lg mb-12 opacity-90">
            Join thousands of job seekers and recruiters building their future with us.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/users/register">
              <motion.button
                whileHover={{ scale: 1.08, y: -3 }}
                className="px-10 py-4 bg-white text-[#4CAF50] font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-100 transition"
              >
                Join as Job Seeker
              </motion.button>
            </Link>
            <Link to="/recruiters/register">
              <motion.button
                whileHover={{ scale: 1.08, y: -3 }}
                className="px-10 py-4 bg-[#111e2d] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-900 transition"
              >
                Join as Recruiter
              </motion.button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <div className="text-center py-6 bg-[#111e2d] text-gray-400 text-sm px-4">
        © 2025 Job Portal. |{" "}
        <a href="/privacy-policy" className="hover:text-[#4CAF50]">Privacy Policy</a> |{" "}
        <a href="/terms-and-conditions" className="hover:text-[#4CAF50]">Terms & Conditions</a>
      </div>
    
    </>
  );
}

export default LandingPage;
