import React,{useRef} from "react";
import { motion,AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom";
import { useState } from "react";
import { FiX } from "react-icons/fi";
function AboutPage() {
  
  

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
    const loginRef = useRef(null);
    
    const sidebarVariants = {
      hidden: { x: "100%",opacity: 0 },
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
            
      <section className="py-24 px-6 md:px-20 bg-gradient-to-b from-[#e0ffe0] to-[#c0f0c0] text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-800 drop-shadow-lg mb-6"
        >
          About <span className="text-[#4CAF50]">JobPortal</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Our mission is to simplify the way job seekers and recruiters connect —
          empowering careers, building companies, and shaping the future of work.
        </motion.p>
      </section>

     
      <section className="py-20 px-6 md:px-20 bg-white">
        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              title: "Our Mission",
              desc: "To bridge the gap between opportunity and talent by providing a seamless, transparent, and efficient platform."
            },
            {
              title: "Our Vision",
              desc: "To become the most trusted global career platform — where every job seeker finds the right opportunity and every recruiter finds the right talent."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition"
            >
              <h2 className="text-3xl font-bold text-[#4CAF50] mb-4">{item.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="py-20 px-6 md:px-20 bg-gray-50 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-gray-800 mb-16"
        >
          Our Core Values
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { title: "Transparency", desc: "We value honesty and clarity in every interaction." },
            { title: "Innovation", desc: "We constantly push boundaries to create smarter solutions." },
            { title: "Trust", desc: "We prioritize building long-lasting relationships with our users." },
          ].map((val, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition"
            >
              <h3 className="text-2xl font-semibold text-[#4CAF50] mb-4">{val.title}</h3>
              <p className="text-gray-600">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-center text-white relative">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg"
        >
          Be Part of Our Journey
        </motion.h2>
        <p className="text-lg mb-8 opacity-90">Let’s shape the future of work together.</p>
        <motion.a
          whileHover={{ scale: 1.08, y: -3 }}
          href="/users/register"
          className="px-8 py-4 bg-white text-[#4CAF50] font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-100 transition"
        >
          Get Started
        </motion.a>
      </section>
    </>
  );
}

export default AboutPage;
