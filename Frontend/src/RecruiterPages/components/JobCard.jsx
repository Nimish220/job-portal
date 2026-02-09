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
      className="relative bg-white p-6 rounded-lg shadow-md flex flex-col lg:flex-row justify-between gap-6 w-full"
    >
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-4 right-2 lg:top-6 lg:right-3 p-2 text-gray-400 cursor-pointer z-20 bg-transparent border-none outline-none"
          title="Edit Posting"
        >
          <FiEdit size={20} />
        </button>
      )}

      {/* Left Section */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{jobTitle}</h3>
        </div>

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

{/* Right Section - High Contrast Branding */}
<div className="flex flex-col justify-end text-sm gap-4 w-full lg:w-auto mt-4 lg:mt-0 font-sans">
  
  <p className="text-slate-400 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-right">
    Post Date: {new Date(opened).toLocaleDateString()}
  </p>

  <div className="flex flex-row items-center justify-between lg:justify-end w-full lg:w-auto gap-2 lg:gap-3">
    
    {/* 1. Applicant Count - Updated with Deeper Backgrounds for Visibility */}
    <div className={`flex flex-row items-center justify-center gap-1.5 h-[42px] flex-1 lg:flex-none lg:w-[100px] rounded-2xl border-2 shadow-sm transition-all ${
      applicantCount > 0 
        ? "bg-emerald-100 border-emerald-200 text-[#4d8006]" 
        : "bg-slate-100 border-slate-200 text-slate-500" 
    }`}>
      <span className="text-sm font-black leading-none">{applicantCount}</span>
      <span className="text-[9px] lg:text-[10px] uppercase font-black tracking-tighter leading-none">Users</span>
    </div>

    {/* 2. Primary Action */}
    {actionButtonLink && (
      <button 
        onClick={actionButtonLink} 
        className="flex-[2] lg:flex-none lg:w-[160px] bg-[#5F9D08] hover:bg-[#4d8006] text-white h-[42px] rounded-2xl text-[10px] lg:text-xs font-black shadow-xl shadow-green-100 transition-all active:scale-95 uppercase tracking-widest px-2"
      >
        {actionButtonText}
      </button>
    )}

    {/* 3. Secondary Action */}
    {secondaryButtonText && (
      <button
        onClick={onSecondaryButtonClick}
        className="flex-1 lg:flex-none lg:w-[120px] bg-slate-100 border-2 border-slate-200 text-slate-700 h-[42px] rounded-2xl text-[10px] lg:text-xs font-black hover:bg-slate-200 transition-all active:scale-95 uppercase tracking-tight px-2"
      >
        {secondaryButtonText}
      </button>
    )}
  </div>
</div>
    </motion.div>
  );
};

export default JobCard;