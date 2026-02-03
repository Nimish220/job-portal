import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Link,  } from 'react-router-dom';

const RecruiterForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Basic Client-Side Validation
        if (!email || !email.includes('@')) {
                return toast.warn("Please enter a valid email address.", { position: "top-center",autoClose: 3000 });
            }
        setLoading(true);

    try {
        const { data } = await axios.post('http://localhost:8000/api/recruiters/forgot-password', { email });
        
        if (data.success) {
            toast.success("Check your business email for the reset link!", { position: "top-center",autoClose: 3000  });
            // Switch to the success UI state (CheckCircle)
                setTimeout(() => {
                setIsSubmitted(true);
                }, 300);
        }
    }  
    catch (error) {
        const errorMsg = error.response?.data?.message || "Unknown error occurred.";
        // 1. Check if the server sent a specific error message
        if (!error.response) {
            toast.error("Network error: Server is unreachable. Please try again later.", { position: "top-center",autoClose: 3000});
        }
        
        // 2. Handle specific status codes if needed
        if (error.response?.status === 404) {
            toast.error(
            <span>
            Recruiter account not found. 
            <br /> Please check the email.
            </span>,{ position: "top-center",autoClose: 3000 });
        } else if (error.response?.status === 429) {
            toast.info(<span>Too many attempts.<br /> Please wait a few minutes before trying again.</span>, { position: "top-center",autoClose: 3000 });
        }else if (error.response?.status === 500) {
            toast.error(<span>Server error. Please try again later.</span>, { position: "top-center",autoClose: 3000 });
        } else {
            // 3. Fallback for network issues or generic errors
            toast.error(errorMsg, { position: "top-center",autoClose: 3000 });
        }
        
        setIsSubmitted(false); // Ensure they can see the form to try again
    } finally {
            setLoading(false);
        }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/*  LAPTOP SCALE: Using lg:max-w-xl and p-10 for balance */}
            <div className="max-w-md lg:max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300"> 
                
                {!isSubmitted ? (
                    <>
                        <div className="text-center">
                            {/*  LARGER ICON: h-16 w-16 for laptop view */}
                            <div className="mx-auto h-16 w-16 bg-green-100 flex items-center justify-center rounded-full mb-6">
                                <Mail className="h-8 w-8 text-[#5F9D08]" />
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                                Recruiter Recovery
                            </h2>
                            <p className="mt-4 text-base text-gray-500">
                                Enter your business email for a reset link.
                            </p>
                        </div>

                        <form className="mt-10 space-y-8" onSubmit={handleFormSubmit}>
                            <div className="rounded-md shadow-sm">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5F9D08] text-base transition-all"
                                    placeholder="recruiter@company.com"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#5F9D08] text-white py-4 px-4 rounded-lg hover:bg-[#4e8206] transition-all font-bold text-lg shadow-md disabled:bg-gray-400 transform hover:scale-[1.01]"
                            >
                                {loading ? "Sending Link..." : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    /* --- SUCCESS STATE: LAPTOP OPTIMIZED --- */
                    <div className="text-center py-10 space-y-8">
                        <div className="mx-auto h-24 w-24 bg-green-100 flex items-center justify-center rounded-full">
                            <CheckCircle className="h-14 w-14 text-[#5F9D08]" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Email Sent!</h2>
                            <p className="text-gray-600 mt-4 text-lg">
                                We've sent a recruiter reset link to <br/>
                                <span className="font-semibold text-gray-900">{email}</span>
                            </p>
                            <p className="text-sm text-gray-400 mt-6 italic underline">
                                Link expires in 15 minutes.
                            </p>
                        </div>
                    </div>
                )}

                {/* Constant Footer (Consistent across roles) */}
                <div className="mt-8 text-center border-t pt-6">
                    <Link to="/recruiters/login" className="flex items-center justify-center text-base font-semibold text-[#5F9D08] hover:underline">
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Recruiter Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecruiterForgotPassword;