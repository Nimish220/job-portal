// Extra changes for role based authorization

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
        const role = res.data.role;

        if (role === "user") {
          await fetchUser();
          setLoading(false);
        } else if (role === "recruiter") {
          await fetchRecruiter();
          setLoading(false);
        }
      } catch (err) {
        console.log(" Not authenticated.");
        setLoading(false);
      } 
      finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return children;
};

export default AuthProvider;
