import React, { useEffect } from 'react';
import { Link, useActionData } from 'react-router-dom';
// import appliedJobsData from '../data/appliedJobs.json'; // Import applied jobs data
import useUserStore from '../store/userStore.js'
const AppliedJobs = () => {

  const {getAppliedJobs,appliedJobs,appliedInternships}=useUserStore()


  useEffect(() => {
    getAppliedJobs()
  }, [getAppliedJobs]);

  console.log("Current Applied Internships:", appliedInternships);

  // Helper function to keep code clean
  const ListBox = ({ title, data, roleKey, routePath }) => (
    <div className="w-full h-auto bg-white text-black rounded-bl-2xl shadow-lg mb-6 overflow-hidden border border-gray-100">
      <div className="bg-[#5F9D08] lg:p-4 md:p-2">
        <h2 className="lg:text-xl font-bold text-white">{title}</h2>
      </div>
      <ul className="lg:p-4 md:p-2 lg:space-y-2 md:space-y-1">
        {data.length === 0 ? (
          <li className="text-gray-400 text-sm">No applications yet.</li>
        ) : (
          data.map((item, index) => (
            <li
              key={item._id}
              className={`hover:bg-gray-100 p-2 rounded transition-colors ${
                index !== data.length - 1 ? 'border-b' : ''
              }`}
            >
              <Link to={`/users/${routePath}/${item._id}`} className="block text-sm font-medium">
                {item[roleKey]}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
  return (
    /*<div className="hidden md:block w-full  h-auto bg-white text-black lg:p-4 md:p-2 rounded-bl-2xl shadow-lg">
      <div className="bg-[#5F9D08] lg:p-4 md:p-2 rounded-bl-2xl">
        <h2 className="lg:text-2xl font-bold text-white">Applied Jobs</h2>
      </div>
      <ul className="lg:p-4 md:p-2 lg:space-y-2 md:space-y-1">
      {appliedJobs.length === 0 ? (
          <li className="text-gray-500 font-bold text-xl">You haven't applied to any jobs yet.</li>
        ) : (
          appliedJobs.map((job, index) => (
            <li
              key={job._id}
              className={`hover:bg-gray-300 text-black p-2 rounded ${
                index !== appliedJobs.length - 1 ? 'border-b' : ''
              }`}
            >
              <Link to={`/users/job/${job._id}`}>
                {job.jobRole}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>*/
    <div className="hidden md:block w-full h-auto lg:p-4 md:p-2 sticky top-24">
      {/* Box 1: Jobs */}
      <ListBox 
        title="Applied Jobs" 
        data={appliedJobs} 
        roleKey="jobRole" 
        routePath="job" 
      />

      {/* Box 2: Internships */}
      <ListBox 
        title="Applied Internships" 
        data={appliedInternships} 
        roleKey="internshipRole" 
        routePath="internship" 
      />
    </div>
  );
};

export default AppliedJobs;
