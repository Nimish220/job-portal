import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import RecruiterLogin from './RecruiterPages/Login_SignUp/RecruiterLogin';
import RecruiterRegister from './RecruiterPages/Login_SignUp/RecruiterRegister';
import AllJobs_ActiveJobs from './RecruiterPages/AllJobs_ActiveJobs';
import AllJobs_ClosedJobs from './RecruiterPages/AllJobs_ClosedJobs.jsx';
import RecruiterProfile from './RecruiterPages/Recruiter Profile/RecruiterProfile';
import RecruiterLogout from './RecruiterPages/Login_SignUp/RecruiterLogout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard.jsx';
import Logout from './pages/Logout.jsx';
import SavedJobs from './pages/SavedJobs.jsx';
import JobRecommendations from './pages/JobRecommendation.jsx';
import Resume from './pages/Resume.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import PostJob_Job from './RecruiterPages/PostJob_Job.jsx';
import PostJob_Internship from './RecruiterPages/PostJob_Internship.jsx';
import NotificationsRecr from './RecruiterPages/NotificationsRecr.jsx';
import AcceptedApplicants from './RecruiterPages/AcceptedApplicants.jsx';
import Applicants from './RecruiterPages/Applicants.jsx';
import UpdateRecruiter from './RecruiterPages/UpdateRecruiter.jsx';
import ApplicantsProfile from './RecruiterPages/ApplicantsProfile.jsx';
import JobPage from './pages/JobPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ChangePassword from './RecruiterPages/RecruiterData/ChangePassword.jsx';
import  userStore  from './store/userStore';
import recruiterStore from './store/recruiterStore';
// import JobDetails from "./pages/JobDetails";
// ✅ NEW IMPORT for Apply Now Page
import ApplyJob from './pages/ApplyJob.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import SubscriptionPlans from './pages/SubscriptionPlans.jsx';
import LearnMore from './pages/LearnMore.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import About from './pages/About.jsx';
import Support from './pages/Support.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

function App() {
  
  return (
    
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/users/register' element={<Register />} />
        <Route path='/users/login' element={<Login />} />
        <Route path='/recruiters/register' element={<RecruiterRegister />} />
        <Route path='/recruiters/login' element={<RecruiterLogin />} />
        <Route path="/subscription" element={<SubscriptionPlans />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        {/* <Route path="/users/job/:id" element={<JobDetails />} /> */}

        {/* User Routes */}
          {/* <Route path='/users/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
          <Route path="/users/dashboard" element={<ProtectedRoute allowedRole="user"><Dashboard /></ProtectedRoute>
} />
  <Route path='/users/logout' element={<ProtectedRoute><Logout /></ProtectedRoute>} />
  <Route path='/users/profile' element={<ProtectedRoute allowedRole="user"><Profile /></ProtectedRoute>} />
  <Route path='/users/resume' element={<ProtectedRoute allowedRole="user"><Resume /></ProtectedRoute>} />
  <Route path='/users/saved-jobs' element={<ProtectedRoute allowedRole="user"><SavedJobs /></ProtectedRoute>} />
  <Route path='/users/edit-profile' element={<ProtectedRoute allowedRole="user"><EditProfile /></ProtectedRoute>} />
  <Route path='/users/job/:id' element={<ProtectedRoute allowedRole="user"><JobPage /></ProtectedRoute>} />
  <Route path='/users/apply/:id' element={<ProtectedRoute allowedRole="user"><ApplyJob /></ProtectedRoute>} />
  <Route path='/users/notifications' element={<ProtectedRoute allowedRole="user"><NotificationsPage /></ProtectedRoute>} />
  <Route path='/users/job-recommendations' element={<ProtectedRoute allowedRole="user"><JobRecommendations /></ProtectedRoute>} />
  <Route path="/users/internship/:id" element={<ProtectedRoute allowedRole="user"><JobPage /></ProtectedRoute>} /> 
  <Route path="/users/internship/apply/:id" element={<ProtectedRoute allowedRole="user"><ApplyJob /></ProtectedRoute>} />
        {/* Recruiter Routes */}
        <Route path='/recruiters/logout' element={<ProtectedRoute><RecruiterLogout /></ProtectedRoute>} />
        <Route path='/recruiters/jobs/active' element={<ProtectedRoute allowedRole="recruiter"><AllJobs_ActiveJobs /></ProtectedRoute>} />
        <Route path='/recruiters/jobs/closed' element={<ProtectedRoute allowedRole="recruiter"><AllJobs_ClosedJobs /></ProtectedRoute>} />
        <Route path='/recruiters/notifications' element={<ProtectedRoute allowedRole="recruiter"><NotificationsRecr /></ProtectedRoute>} />
        <Route path='/recruiters/getProfile' element={<ProtectedRoute allowedRole="recruiter"><RecruiterProfile /></ProtectedRoute>} />
        <Route path='/recruiters/postJob' element={<ProtectedRoute allowedRole="recruiter"><PostJob_Job /></ProtectedRoute>} />
        <Route path='/recruiters/postInternship' element={<ProtectedRoute allowedRole="recruiter"><PostJob_Internship /></ProtectedRoute>} />
        <Route path='/recruiters/acceptedApplicants' element={<ProtectedRoute allowedRole="recruiter"><AcceptedApplicants /></ProtectedRoute>} />
        <Route path='/recruiters/applicants/:jobId' element={<ProtectedRoute allowedRole="recruiter"><Applicants /></ProtectedRoute>} />
        <Route path='/recruiters/internshipApplicants/:jobId' element={<ProtectedRoute allowedRole="recruiter"><Applicants /></ProtectedRoute>} />
        <Route path='/recruiters/updateRecruiter' element={<ProtectedRoute allowedRole="recruiter"><UpdateRecruiter /></ProtectedRoute>} />
        <Route path='/recruiters/applicantsProfile/:jobId/:applicantId' element={<ProtectedRoute allowedRole="recruiter"><ApplicantsProfile /></ProtectedRoute>} />
        <Route path='/recruiters/post-job/job' element={<ProtectedRoute allowedRole="recruiter"><PostJob_Job /></ProtectedRoute>} />
        {/* ✅ Add this to App.js so the profile page knows it is an Internship applicant */}
      <Route 
        path='/recruiters/internshipApplicants/:jobId/:applicantId' 
        element={<ProtectedRoute allowedRole="recruiter"><ApplicantsProfile /></ProtectedRoute>} 
      />
        {/* <Route path='/recruiters/applicants/:jobId' element={<Applicants />} /> */}
        <Route path='/recruiters/post-job/internship' element={<ProtectedRoute allowedRole="recruiter"><PostJob_Internship /></ProtectedRoute>} />
        <Route path='/recruiters/change-password' element={<ChangePassword />} />

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


export default App;