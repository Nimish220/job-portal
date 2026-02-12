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

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full py-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#5F9D08] mb-3"></div>
          <p className="text-[#5F9D08] font-medium text-sm">
            Loading Details...
          </p>
        </div>
      </div>
    );
  }

  if (!company)
    return (
      <div className="text-center py-6 text-red-500 font-medium text-sm">
        No profile found.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6"
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
        <div className="flex flex-col items-start space-y-1 sm:col-span-2">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
            PAN / GST Document <span className="text-red-500">(PDF ONLY)</span>
          </span>
          {company.companyPanCardOrGstFile ? (
            <a
              href={company.companyPanCardOrGstFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5F9D08] font-semibold hover:underline break-all text-sm"
            >
              View Document
            </a>
          ) : (
            <p className="text-gray-500 italic text-sm">
              No document uploaded
            </p>
          )}
        </div>
      </Section>

      <div className="pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/recruiters/update-company")}
          className="w-full py-3 bg-[#5F9D08] text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition-all"
        >
          Edit Company Profile
        </motion.button>
      </div>
    </motion.div>
  );
};

const Section = ({ title, children }) => (
  <section className="w-full">
    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
      {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
      {children}
    </div>
  </section>
);

const InfoRow = ({ label, value, isLink }) => (
  <div className="flex flex-col space-y-1 text-left">
    <label className="text-xs font-semibold text-gray-600">
      {label}
    </label>

    {isLink && value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-[#5F9D08] font-medium hover:underline break-all"
      >
        {value}
      </a>
    ) : (
      <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 font-medium">
        {value || "—"}
      </div>
    )}
  </div>
);


export default CompanyProfileForm;
