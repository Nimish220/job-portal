import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const UpdateCompanyProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    address: "",
    industry_type: "",
    description: "",
  });

  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [panFile, setPanFile] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axiosInstance.get("recruiters/getProfile");
        const recruiter = res.data.recruiter;

        setFormData({
          companyName: recruiter.companyName || "",
          website: recruiter.website || "",
          address: recruiter.address || "",
          industry_type: recruiter.industry_type || "",
          description: recruiter.description || "",
        });

        setLoading(false);
      } catch (err) {
        toast.error("Failed to load company data");
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (logo) data.append("logo", logo);
      if (panFile) data.append("companyPanCardOrGstFile", panFile);


      const res = await axiosInstance.post("recruiters/update",data);

      if (res.data.success) {
        toast.success("Company updated successfully!");
        navigate("/recruiters/getProfile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-[#5F9D08] mb-6">
          Update Company Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
          <Input label="Website" name="website" value={formData.website} onChange={handleChange} />
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
          <Input label="Industry Type" name="industry_type" value={formData.industry_type} onChange={handleChange} />

          <div>
            <label className="text-sm font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-xl"
              rows="4"
            />
          </div>

        <div>
            <label className="text-sm font-semibold">PAN / GST Document</label>
            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPanFile(e.target.files[0])}
                className="mt-2"
            />
            </div>

            <div>
            <label className="text-sm font-semibold">Company Logo</label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
                className="mt-2"
            />
        </div>


          <button
            type="submit"
            className="w-full py-3 bg-[#5F9D08] text-white font-bold rounded-xl hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <input
      {...props}
      className="w-full mt-2 p-3 border rounded-xl"
    />
  </div>
);

export default UpdateCompanyProfile;
