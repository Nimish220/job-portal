import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // <-- ADDED: useLocation

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = useLocation(); // <-- ADDED: Get current location object

  // Determine if this application is for an Internship
  // Assumes internship application routes include '/internship/apply'
  const isInternship = loc.pathname.includes('/internship/apply'); // <-- NEW LOGIC

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
  const backend_url = import.meta.env.VITE_BACKEND_URL

  // Handle input changes (remains unchanged)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input change (remains unchanged)
  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  // Submit application (MODIFIED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      alert("Please upload your resume.");
      return;
    }

    setLoading(true);

    // 1. Dynamic Endpoint based on page type
    const endpoint = isInternship 
      ? backend_url + "/api/users/applyInternship" 
      : backend_url + "/api/users/applyJob"; 
    
    // 2. Map ID to the key the controller expects
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

      // 3. Send request
      const res = await fetch(endpoint, {
        method: "PUT", 
        credentials: "include", 
        body: form,
      });

      const data = await res.json();

      // 4. Use res.ok (true for 200-299) to handle success
      if (res.ok) {
        alert(`Application for ${isInternship ? 'Internship' : 'Job'} submitted successfully!`);
        console.log("Success:", data);
        
        // Use an absolute path for navigation
        navigate("/dashboard"); 
      } else {
        // If the middleware returns 403 or 401, this block handles it
        alert(`Application Error: ${data.message || "Failed to submit"}`);
        console.error("Backend Error Details:", data);
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
          <h2 className="text-2xl font-bold mb-6 text-center">
                Apply for {isInternship ? 'Internship' : 'Job'} #{id}
            </h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* ... rest of the form fields remain the same ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="fullName"
                required
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                name="email"
                required
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                name="phone"
                required
                placeholder="Phone *"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <select
                name="experience"
                required
                value={formData.experience}
                onChange={handleChange}
                className="border p-2 rounded"
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
                className="border p-2 rounded"
              />
              <select
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="Immediate">Immediate</option>
                <option value="15 Days">15 Days</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Resume/CV *</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="block w-full border p-2 rounded"
              />
              <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX (max 5MB)</p>
            </div>

            <div className="mt-4">
              <textarea
                name="coverLetter"
                rows="4"
                placeholder="Cover Letter (Optional)"
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
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