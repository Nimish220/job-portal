import { useEffect, useState } from "react";
import userStore from "./store/userStore";
import recruiterStore from "./store/recruiterStore";
import { axiosInstance } from "./utils/axiosInstance";


const AuthProvider = ({ children }) => {
  const fetchUser = userStore((state) => state.fetchUser);
  const fetchRecruiter = recruiterStore((state) => state.fetchRecruiter);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        
        // If the backend says we have a session
        if (res.data.authenticated) {
          if (res.data.role === "user") {
            await fetchUser();
          } else if (res.data.role === "recruiter") {
            await fetchRecruiter();
          }
        } else {
          console.log("No active session found (Guest).");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, [fetchUser, fetchRecruiter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F9D08]"></div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;