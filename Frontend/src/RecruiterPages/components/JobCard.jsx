import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiEdit } from 'react-icons/fi';

const JobCard = ({
  jobTitle,
  location,
  salaryRange,
  jobDescription,
  skills,
  eligibilityCriteria,
  opened,
  status,
  applicantCount,
  actionButtonText,
  secondaryButtonText,
  actionButtonLink,
  onSecondaryButtonClick,
  statusText,
  onEdit,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      /*whileHover={{
        scale: 1.02,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        transition: { duration: 0.3 },
      }}*/
     className="relative bg-white p-6 rounded-lg shadow-md flex flex-col lg:flex-row justify-between gap-6 w-full"
    >
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            /* right-2 pins it to the absolute edge of the box */
            className="absolute top-4 right-2 lg:top-6 lg:right-3 p-2 text-gray-400 cursor-pointer z-20 bg-transparent border-none outline-none"
            title="Edit Posting"
          >
            <FiEdit size={20} />
          </button>
        )}
      {/* Left Section */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{jobTitle}</h3>
          <div className="flex gap-2 mt-1 sm:mt-0">
            {/* <Link to="/accepted-applicants">
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                Accepted
              </span>
            </Link>
            <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
              Rejected
            </span> */}
          </div>
        </div>

        {/* Job Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-500">Location</p>
            <p className="font-semibold">{location}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Salary</p>
            <p className="font-semibold">{salaryRange}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Skills</p>
            <p className="font-semibold">{skills}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Eligibility</p>
            <p className="font-semibold">{eligibilityCriteria}</p>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <p className="font-medium text-gray-500">Job Description</p>
            <p className="font-semibold">{jobDescription}</p>
          </div>
        </div>
      </div>

     {/* Right Section */}
      <div className="flex flex-col justify-end items-end text-sm gap-4 w-full lg:w-auto mt-4 lg:mt-0">
        <p className="text-gray-400 text-[10px] lg:text-[11px] font-semibold uppercase tracking-wider">
          Post Date: {new Date(opened).toLocaleDateString()}
        </p>

        {/* MOBILE: justify-end moves everything to the right side */}
        <div className="flex flex-row items-center justify-end w-full lg:w-auto gap-2 lg:gap-3">
          
          {/*  Smaller Applicant Badge for Mobile */}
          <div className={`flex items-center gap-1 lg:gap-2 px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg border shadow-sm transition-all ${
            applicantCount > 0 
              ? "bg-blue-50 border-blue-200 text-blue-700" 
              : "bg-gray-50 border-gray-200 text-gray-400"
          }`}>
            <span className="text-sm lg:text-lg font-bold leading-none">{applicantCount}</span>
            <span className="text-[8px] lg:text-[10px] uppercase font-bold leading-none tracking-tighter">
              {applicantCount === 1 ? "User" : "Users"}
            </span>
          </div>

          {/*  Smaller Buttons for Mobile, same size on Laptop */}
          <div className="flex items-center gap-1.5 lg:gap-2">
            {actionButtonLink && (
              <button 
                onClick={actionButtonLink} 
                className="bg-[#5F9D08] hover:bg-[#4b7b06] text-white px-3 lg:px-5 py-2 rounded-md transition-all text-[11px] lg:text-xs font-bold shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {actionButtonText}
              </button>
            )}

            {secondaryButtonText && (
              <button
                onClick={onSecondaryButtonClick}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 px-3 lg:px-4 py-2 rounded-md text-[11px] lg:text-xs font-medium transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
