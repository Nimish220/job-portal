import express from "express";
import upload from "../middlewares/multer.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

const getUserId = (req) => {
  const token = req.cookies.token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id || decoded._id;
  } catch (err) { return null; }
};

router.post("/resume", upload.single("resume"), async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId || !req.file) return res.status(400).json({ error: "Invalid request" });

    // ✅ STRICT PDF CHECK
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Please upload a PDF file." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { 
          resume: { 
            fileName: req.file.originalname, 
            fileUrl: req.file.path, 
            publicId: req.file.filename 
          } 
        } 
      },
      { new: true }
    );

    res.status(200).json({ message: "Uploaded", resumes: updatedUser.resume });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/resume", async (req, res) => {
  try {
    const userId = getUserId(req);
    const user = await User.findById(userId);
    res.status(200).json({ resumes: user.resume });
  } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
});

router.put("/resume/:resumeId", async (req, res) => {
  try {
    const userId = getUserId(req);
    await User.findOneAndUpdate(
      { _id: userId, "resume._id": req.params.resumeId },
      { $set: { "resume.$.fileName": req.body.newFileName } }
    );
    res.status(200).json({ message: "Renamed" });
  } catch (err) { res.status(500).json({ error: "Rename failed" }); }
});

router.delete("/resume/:resumeId", async (req, res) => {
  try {
    const userId = getUserId(req);
    await User.findByIdAndUpdate(userId, { $pull: { resume: { _id: req.params.resumeId } } });
    res.status(200).json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

export default router;