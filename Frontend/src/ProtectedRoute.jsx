import { Navigate } from "react-router-dom";
import userStore from "./store/userStore";
import recruiterStore from "./store/recruiterStore";  //extra changes for role based authorization.

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = userStore((state) => state.user);
  const recruiter = recruiterStore((state) => state.recruiter);
  const loading = recruiterStore((state) => state.loading); 

  // If the store is still fetching data, don't redirect yet!
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F9D08]"></div>
      </div>
    );
  }
  if (allowedRole === "user" && !user) {
    return <Navigate to="/users/login" replace />;
  }

  if (allowedRole === "recruiter" && !recruiter) {
    return <Navigate to="/recruiters/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
