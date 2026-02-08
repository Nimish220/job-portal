import React, { useState,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "Free",
    features: [
      "Post up to 2 jobs/internships per month",
      "Access up to 20 candidate resumes",
      "Limited access to candidate profiles",
      "Basic candidate search (limited filters)",
      "Messaging with candidates",
      "Standard customer support",
    ],
  },
  {
    name: "Bronze",
    price: "₹99 / month",
    features: [
      "Affordable plan for growing recruiters.",
      "Post up to 20 jobs/internships per month",
      "Unlimited access to candidate resumes",
      "Basic candidate search + access to resumes",
      "Email & Call support (11 AM – 6 PM)",
    ],
  },
  {
    name: "Silver",
    price: "₹199 / month",
    features: [
      "Best value for recruiters with regular hiring needs.",
      "Post up to 50 jobs/internships per month",
      "Unlimited access to candidate resumes",
      "Unlock candidate phone numbers",
      "Advanced candidate search & filters",
      "Email & Call support (11 AM – 6 PM)",
    ],
    popular: true,
  },
  {
    name: "Gold",
    price: "₹399 / month",
    features: [
      "Premium plan for serious hiring teams.",
      "Post up to 100 jobs/internships per month",
      "Unlimited access to candidate resumes",
      "Unlock candidate phone numbers",
      "Full candidate search with all filters",
      "24/7 priority support",
      "Money-back guarantee if no candidates are hired",
    ],
  },
];

const SubscriptionPlans = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
      const loginRef = useRef(null);
  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
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

      {/* Plans Section */}
      <section className="py-28 px-6 md:px-20 text-center bg-gray-50">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 max-w-3xl mx-auto mb-12 leading-tight"
        >
          Recruiter Subscription Plans
        </motion.h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-20 leading-relaxed">
          Scale your hiring with plans designed to give recruiters the right tools & visibility.
        </p>

        {/* 2x2 Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              whileHover={{ scale: 1.08, boxShadow: "0 10px 30px rgba(72, 187, 120, 0.3)" }}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.25 }}
              className={`bg-white rounded-3xl p-14 shadow-lg border transition-colors ${
                plan.popular
                  ? "border-green-600 bg-gradient-to-b from-green-50 via-white to-white"
                  : "border-gray-300"
              }`}
            >
              <h2 className="text-4xl font-extrabold text-gray-800 mb-6">{plan.name}</h2>
              <p className="text-5xl font-extrabold text-green-600 mb-12">{plan.price}</p>
              <ul className="space-y-6 mb-12 text-left text-gray-700 leading-relaxed text-lg">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle className="w-7 h-7 flex-shrink-0 text-green-500 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-5 rounded-full text-xl font-semibold transition-shadow duration-300 ${
                  plan.popular
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-2xl"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default SubscriptionPlans;
