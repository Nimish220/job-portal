import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

const CompanyProfileForm = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.updatedRecruiter) {
      setCompany(location.state.updatedRecruiter);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("recruiters/getProfile");
        setCompany(res.data.recruiter || null);
      } catch (error) {
        console.error("Fetch error:", error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [location.state]);

  if (loading)
    return (
      <div className="text-center py-6 text-gray-400 font-medium animate-pulse">
        Loading details...
      </div>
    );

  if (!company)
    return (
      <div className="text-center py-6 text-red-500 font-semibold">
        No profile found.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-10"
    >
      <Section title="General Information">
        <InfoRow label="Company Name" value={company.companyName} />
        <InfoRow label="Industry" value={company.industry_type} />
      </Section>

      <Section title="Contact Details">
        <InfoRow label="Email Address" value={company.email} />
        <InfoRow label="Phone Number" value={company.phone} />
      </Section>

      <Section title="Social & Web">
        <InfoRow label="Website" value={company.website} isLink />
        <InfoRow label="LinkedIn" value={company.linkedin} isLink />
      </Section>

      <Section title="Verification Document">
        {company.companyPanCardOrGstFile ? (
          <a
            href={company.companyPanCardOrGstFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5F9D08] font-semibold hover:underline break-all"
          >
            View PAN / GST Document
          </a>
        ) : (
          <p className="text-gray-400 italic text-sm">
            No document uploaded
          </p>
        )}
      </Section>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() =>
          navigate("/recruiters/update-company")
        }
        className="w-full py-4 bg-[#5F9D08] text-white font-bold rounded-xl shadow-md hover:bg-green-700 transition-all"
      >
        Edit Company Profile
      </motion.button>
    </motion.div>
  );
};

const Section = ({ title, children }) => (
  <section className="w-full">
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
      {title}
      <span className="ml-4 flex-1 h-[1px] bg-gray-200"></span>
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
      {children}
    </div>
  </section>
);

const InfoRow = ({ label, value, isLink }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      {label}
    </span>

    {isLink && value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#5F9D08] font-semibold hover:underline break-all"
      >
        {value}
      </a>
    ) : (
      <p className="text-gray-900 font-semibold text-sm">
        {value || "—"}
      </p>
    )}
  </div>
);

export default CompanyProfileForm;
