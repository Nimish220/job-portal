import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const RecruiterResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // ✅ Added for consistency
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    //  Using your environment variable
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        return () => toast.dismiss();
    }, []);

    const handleReset = async (e) => {
        e.preventDefault();
        toast.dismiss(); // Clear old errors
        
        // 1. Length Validation
        if (password.length < 6) {
            return toast.warn("Password must be at least 6 characters.", { position: "top-center" });
        }

        // 2. Matching Validation
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match!", { position: "top-center" });
        }

        setLoading(true);

        try {
            //  Updated: Using backend_url variable and recruiter endpoint
            const { data } = await axios.put(`${backend_url}/api/recruiters/reset-password/${token}`, { password });
            
            if (data.success) {
                toast.success("Recruiter password updated! Redirecting...", { position: "top-center" });
                
                // Give user time to read the message
                setTimeout(() => {
                    navigate("/recruiters/login");
                }, 3000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Reset failed. Link may be expired.";
            
            if (!error.response) {
                toast.error("Network error: Server unreachable.", { position: "top-center" });
            } else if (error.response.status === 400) {
                //  Multi-line fix for small screens
                toast.error(
                    <span>Expired or invalid token. <br /> Please request a new link.</span>, 
                    { position: "top-center" }
                );
            } else {
                toast.error(errorMsg, { position: "top-center" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md lg:max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300">
                
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-[#5F9D08]/10 flex items-center justify-center rounded-full mb-6">
                        <Lock className="h-8 w-8 text-[#5F9D08]" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Recruiter Reset
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        Secure your business account with a new password.
                    </p>
                </div>

                <form className="mt-10 space-y-6" onSubmit={handleReset}>
                    {/* NEW PASSWORD */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5F9D08] text-base transition-all"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5F9D08] text-base transition-all"
                            placeholder="••••••••"
                        />
                         <button
                            type="button"
                            className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#5F9D08] text-white py-4 px-4 rounded-lg hover:bg-[#4e8206] transition-all font-bold text-lg shadow-md disabled:bg-gray-400 transform hover:scale-[1.01]"
                    >
                        {loading ? "Updating Account..." : "Update Password"}
                    </button>
                </form>

                <div className="mt-8 text-center border-t pt-6">
                    <Link to="/recruiters/login" className="flex items-center justify-center text-base font-semibold text-[#5F9D08] hover:underline">
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Recruiter Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecruiterResetPassword;