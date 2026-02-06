import express from "express";
import upload from "../middlewares/multer.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { protect, isSeeker } from "../middlewares/authMiddleware.js";
import { User } from "../models/User.js";
import multer from "multer";

const router = express.Router();


// POST Route (Remains robust with buffer upload)
router.post("/resume",protect, isSeeker, (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ error: "Max limit 2MB" });
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const userId = req.user._id; //  Using req.user set by protect middleware
    if (!userId || !req.file) return res.status(400).json({ error: "Invalid request" });

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "resumes", resource_type: "auto" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        uploadStream.end(req.file.buffer);
      });
    };

    const result = await uploadToCloudinary();
    if (!result || !result.secure_url) return res.status(400).json({ error: "Cloudinary failed" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { resume: { fileName: req.file.originalname, fileUrl: result.secure_url, publicId: result.public_id } } },
      { new: true }
    );
    res.status(200).json({ message: "Uploaded", resumes: updatedUser.resume });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// GET Route (Added safety check for user existence)
router.get("/resume", protect, isSeeker, async (req, res) => {
  try {
    // req.user is already populated with the full user object by 'protect'
    const user = req.user; 
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const resumeData = user.resume || [];
    res.status(200).json({ resumes: resumeData });
  } catch (err) { 
    res.status(500).json({ error: "Fetch failed" }); 
  }
});

//  FIXED DELETE ROUTE (Added strict null checks to prevent 500 error)
router.delete("/resume/:resumeId",protect, isSeeker, async (req, res) => {
  try {
    const userId =req.user._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user || !user.resume) return res.status(404).json({ error: "User or data not found" });

    const resume = user.resume.find(r => r._id.toString() === req.params.resumeId);
    
    // Only attempt Cloudinary delete if the file was actually uploaded to the cloud
    if (resume && resume.publicId) {
      try {
        await cloudinary.uploader.destroy(resume.publicId, { resource_type: "auto" });
      } catch (cloudinaryErr) {
        console.error("Cloudinary Delete Failed:", cloudinaryErr.message);
      }
    }

    // Pull from MongoDB even if Cloudinary fails (to clean up broken links)
    await User.findByIdAndUpdate(userId, { $pull: { resume: { _id: req.params.resumeId } } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server failed to delete item" });
  }
});

// @route   PUT /api/upload/resume/:resumeId
router.put("/resume/:resumeId",protect, isSeeker, async (req, res) => {
  try {
    const userId =req.user._id;
    const { newFileName } = req.body;

    if (!newFileName) {
      return res.status(400).json({ error: "New file name is required" });
    }

    // Update the specific resume inside the user's resume array
    const user = await User.findOneAndUpdate(
      { _id: userId, "resume._id": req.params.resumeId },
      { $set: { "resume.$.fileName": newFileName } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "Resume not found" });

    res.status(200).json({ message: "Renamed successfully", resumes: user.resume });
  } catch (err) {
    res.status(500).json({ error: "Rename failed" });
  }
});

export default router;