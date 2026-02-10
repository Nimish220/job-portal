import express from "express";
import {
  registerUser,
  loginUser,
  editProfile,
  userlogout,
  getJobs,
  applyToJobs,
  applyToInternships,
  getAppliedJobs,
  getCurrentUser,
  removeSavedJob,
  getInternships,
  getInternshipById,
  forgotPassword,
  resetPassword,
  updateProfilePhoto
} from "../controllers/userController.js";
import { isSeeker, protect } from "../middlewares/authMiddleware.js";
import upload,{uploadImage} from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/editProfile", protect, editProfile);
router.get("/getJobs", protect, isSeeker, getJobs);
router.post("/logout", protect, isSeeker, userlogout);

// note: multer included so multipart/form-data (FormData) will be parsed
router.put("/applyJob", protect, isSeeker, upload.single("resume"), applyToJobs);

router.get("/getAppliedJobs", protect, isSeeker, getAppliedJobs);
router.get("/profile", protect, isSeeker, getCurrentUser);
router.put("/edit-profile", protect, isSeeker, editProfile);
router.delete("/savedJobs/:jobId", protect, removeSavedJob);
router.get("/getInternships", protect, isSeeker, getInternships);
router.get("/internship/:id", protect, isSeeker, getInternshipById);
router.put("/applyInternship", protect, isSeeker, upload.single("resume"), applyToInternships);
router.get('/me', protect,isSeeker, getCurrentUser);
router.post("/forgot-password", forgotPassword); // Sends the email
router.put("/reset-password/:token", resetPassword); // Updates the password in DB
router.put("/update-photo", protect, isSeeker, uploadImage.single("profilePhoto"), updateProfilePhoto);
export default router;
