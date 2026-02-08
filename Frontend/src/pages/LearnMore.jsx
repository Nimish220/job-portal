import React from "react";
import { Link } from "react-router-dom";

const LearnMore = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Learn More About JobPortal
        </h1>
        <p className="text-gray-600 mb-6">
          JobPortal is designed to connect talented job seekers with recruiters 
          looking for the right candidates. Whether you’re applying for your 
          first job or hiring for your growing team, our platform makes the 
          process simple and effective.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Key Features
        </h2>
        <ul className="list-disc pl-5 text-gray-600 mb-6">
          <li>Easy registration for both Job Seekers and Recruiters</li>
          <li>Dedicated dashboards to manage applications and postings</li>
          <li>Simple job posting with clear details for recruiters</li>
          <li>Browse and apply to jobs with just a few clicks</li>
          <li>Support for users through our help center</li>
          <li>Subscription plans tailored for recruiters</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Why Choose Us?
        </h2>
        <p className="text-gray-600 mb-6">
          We provide a professional, user-friendly platform that bridges the 
          gap between opportunity and talent. With our streamlined process, 
          recruiters save time finding the right candidates, and job seekers 
          get access to the latest openings in one place.
        </p>

        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Back to Home
          </Link>
          <Link
            to="/users/register"
            className="px-6 py-2 bg-[#5F9D08] text-white rounded-lg hover:bg-[#43a047] transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
