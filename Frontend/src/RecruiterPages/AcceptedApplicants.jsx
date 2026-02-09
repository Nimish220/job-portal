import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import photo1 from '../assets/images/Profile_pics/1.jpg';
import photo2 from '../assets/images/Profile_pics/2.jpg';
import photo3 from '../assets/images/Profile_pics/3.jpg';
import Sidebar from '../components/SideBar_Recr';
import Navbar from './Notifications/Navbar';
import { axiosInstance } from '../utils/axiosInstance';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';

const applicants = [
  { id: 1, name: "Prachi Shirsale", course: "MCA Management", photo: photo1 },
  { id: 2, name: "Sakshi Kulkarni", course: "MCA Management", photo: photo2 },
  { id: 3, name: "Rohini Deshmukh", course: "MCA Management", photo: photo3 },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function AcceptedApplicants() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [acceptedApplicants, setAcceptedApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = screenWidth < 768;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        setLoading(true);
        // Adjust this endpoint string to match your actual backend route for accepted candidates
        const res = await axiosInstance.get('recruiters/accepted-applicants');
        setAcceptedApplicants(res.data.applicants || []);
      } catch (error) {
        console.error("Error fetching accepted applicants:", error);
        toast.error("Failed to load accepted applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchAccepted();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col gap-10">
      {/* Top Navbar */}
      <Navbar pageName="Accepted Applicants" />

      <div className="flex flex-col lg:flex-row relative">
        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-3xl text-[#5F9D08] cursor-pointer"
          >
            <FiMenu />
          </button>
        </div>

        {/* Static Sidebar on Large Screens */}
        {!isMobile && (
          <div className="hidden lg:block fixed top-20 left-0 z-30">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}

        {/* Animated Sidebar for Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              isMobile={true}
            />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-6 mt-4 lg:mt-6 lg:ml-60">
          <motion.div
            className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
              Accepted Applicants
            </h2>

            <div className="space-y-6">
              {applicants.map((applicant) => (
                <motion.div
                  key={applicant.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex flex-col sm:flex-row items-center justify-between border border-gray-100 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md"
                >
                  {/* Profile Info */}
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-20 h-20 rounded-full border-2 border-dotted border-gray-300 p-1">
                      <img
                        src={applicant.photo}
                        alt={`${applicant.name}'s Profile`}
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {applicant.name}
                      </h3>
                      <p className="text-sm text-gray-500">{applicant.course}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link to={`/applicants-profile/${applicant.id}`}>
                      <button className="bg-[#5F9D08] hover:bg-[#4a7c06] text-white px-5 py-2 rounded-md transition font-medium">
                        View Profile
                      </button>
                    </Link>
                    <button className="border border-[#5F9D08] text-[#5F9D08] hover:bg-[#f0fdf4] px-5 py-2 rounded-md transition font-medium">
                      View Resume
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
