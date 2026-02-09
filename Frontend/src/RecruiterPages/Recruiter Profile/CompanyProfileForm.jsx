import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

const CompanyProfileForm = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const backend_url = import.meta.env.VITE_BACKEND_URL
  useEffect(() => {
    if (location.state?.updatedRecruiter) {
      setCompany(location.state.updatedRecruiter);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await axiosInstance.get("recruiters/getProfile");
        setCompany(res.data.recruiter || null);
      } catch {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.state]);

  if (loading) return <p className="p-4 text-gray-600">Loading company profile...</p>;
  if (!company) return <p className="p-4 text-red-500">No company profile found.</p>;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-lg rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-[#5F9D08]">
        Company Profile
      </h2>

      <Section title="Company Info">
        <InfoRow label="Company Name" value={company.companyName} />
      </Section>

      <Section title="Contact Info">
        <InfoRow label="Email" value={company.email} />
        <InfoRow label="Phone" value={company.phone} />
      </Section>

      <Section title="Company Document">
        {company.companyPanCardOrGstFile ? (
          <a
            href={company.companyPanCardOrGstFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Uploaded Document
          </a>
        ) : (
          <p className="text-gray-600">No document uploaded</p>
        )}
      </Section>

      <div className="text-center">

<button
  type="button" // Good practice to prevent form issues
  onClick={() =>
    navigate("/recruiters/updateRecruiter", { state: { recruiter: company } })
  }
  className="w-full md:w-1/2 py-3 bg-[#5F9D08] text-white font-semibold rounded-md"
>
  Edit Recruiter
</button>
      </div>
    </motion.div>
  );
};

const Section = ({ title, children }) => (
  <section className="mb-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
      {children}
    </div>
  </section>
);

const InfoRow = ({ label, value, isLink }) => (
  <div>
    <span className="block font-medium">{label}</span>
    {isLink && value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline truncate"
      >
        {value}
      </a>
    ) : (
      <p className="text-gray-600">{value || "N/A"}</p>
    )}
  </div>
);

export default CompanyProfileForm;
