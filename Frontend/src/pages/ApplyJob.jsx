import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();

  // Determine if this application is for an Internship
  const isInternship = loc.pathname.includes('/internship/apply');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    currentCompany: '',
    noticePeriod: 'Immediate',
    coverLetter: '',
    resume: null,
  });

  const [loading, setLoading] = useState(false);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change with 2MB validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (file.size > maxSize) {
        alert("File size exceeds 2MB! Please upload a smaller file.");
        e.target.value = ""; // Reset the input field
        setFormData((prev) => ({ ...prev, resume: null }));
        return;
      }
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      alert("Please upload your resume.");
      return;
    }

    setLoading(true);

    // Dynamic Endpoint and Key based on page type
    const endpoint = isInternship
      ? `${backend_url}/api/users/applyInternship`
      : `${backend_url}/api/users/applyJob`;

    const idKey = isInternship ? "internshipId" : "jobId";

    try {
      const form = new FormData();
      form.append(idKey, id);
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("experience", formData.experience);
      form.append("currentCompany", formData.currentCompany);
      form.append("noticePeriod", formData.noticePeriod);
      form.append("coverLetter", formData.coverLetter);
      form.append("resume", formData.resume);

      const res = await fetch(endpoint, {
        method: "PUT",
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Application for ${isInternship ? 'Internship' : 'Job'} submitted successfully!`);
        navigate("/users/dashboard");
      } else {
        alert(`Application Error: ${data.message || "Failed to submit"}`);
      }
    } catch (err) {
      console.error("Network/System Error:", err);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Apply for {isInternship ? 'Internship' : 'Job'}
          </h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="fullName"
                required
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                name="email"
                required
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                name="phone"
                required
                placeholder="Phone *"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                name="experience"
                required
                value={formData.experience}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
              <input
                name="currentCompany"
                placeholder="Current Company"
                value={formData.currentCompany}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Immediate">Immediate</option>
                <option value="15 Days">15 Days</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
              </select>
            </div>

            {/* Resume Upload Section */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-gray-700">
                <i className="fas fa-file-pdf text-red-500"></i>
                <i className="fas fa-file-word text-blue-500"></i>
                <i className="fas fa-file-image text-purple-500"></i>
                Resume/CV (File or Image) *
              </label>

              <div className="group relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors bg-gray-50">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2 group-hover:text-green-500 transition-colors"></i>
                  <p className="text-sm text-gray-600">
                    {formData.resume ? (
                      <span className="text-green-600 font-semibold">
                        Selected: {formData.resume.name}
                      </span>
                    ) : (
                      "Click to upload or drag and drop"
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 uppercase">PDF, DOC, DOCX, IMG (Max 2MB)</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <textarea
                name="coverLetter"
                rows="4"
                placeholder="Cover Letter (Optional)"
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/users/dashboard")}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-medium text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded text-white font-bold transition-all shadow-md ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-95"
                }`}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;