import express from "express";
import { Job } from "../models/Job.js";
import { Internship } from "../models/Internship.js";
import { protect, isRecruiter } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/applications/apply
 * @desc    Apply for a job
 */
router.post("/apply", async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.candidates.includes(candidateId)) {
      return res.status(400).json({ message: "Already applied" });
    }

    job.candidates.push(candidateId);
    await job.save();

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/applications/job/:jobId
 * @desc    Get all candidates for a specific JOB
 */
router.get("/job/:jobId", protect, isRecruiter, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate("candidates", "name email university degree github about skills profilePhoto"); 

    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job.candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/applications/internship/:jobId
 * @desc    Get all candidates for a specific INTERNSHIP
 */
router.get("/internship/:jobId", protect, isRecruiter, async (req, res) => {
  try {
    // We use Internship model here
    const internshipData = await Internship.findById(req.params.jobId)
      .populate("candidates", "name email university degree github about skills profilePhoto"); 

    if (!internshipData) {
      return res.status(404).json({ message: "Internship record not found" });
    }
    
    res.json(internshipData.candidates);
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

/**
 * @route   PUT /api/applications/job/:jobId/candidate/:candidateId/status
 * @desc    Update candidate status
 */
router.put("/job/:jobId/candidate/:candidateId/status", protect, isRecruiter, async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!job.candidates.includes(req.params.candidateId))
      return res.status(404).json({ message: "Candidate not found in this job" });

    res.json({ message: `Candidate ${req.params.candidateId} marked as ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/applications/internship/:jobId/candidate/:candidateId/status
 * @desc    Update internship candidate status
 */
router.put("/internship/:jobId/candidate/:candidateId/status", protect, isRecruiter, async (req, res) => {
  try {
    const { status } = req.body;
    // We query the Internship model specifically here
    const internship = await Internship.findById(req.params.jobId);

    if (!internship) return res.status(404).json({ message: "Internship not found" });
    
    if (!internship.candidates.includes(req.params.candidateId))
      return res.status(404).json({ message: "Candidate not found in this internship" });

    // Success response
    res.json({ 
      message: `Candidate ${req.params.candidateId} marked as ${status} for Internship`,
      status 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/applications/my-applications
 * @desc    Get applications for the logged-in user to show "Shortlisted" status
 */
router.get("/my-applications", protect, async (req, res) => {
  try {
    // Find Jobs where this user's ID is in the candidates array
    const jobs = await Job.find({ candidates: req.user._id }).select("status title");
    
    // Find Internships where this user's ID is in the candidates array
    const internships = await Internship.find({ candidates: req.user._id }).select("status title");

    // Combine them into one array
    const allApplications = [...jobs, ...internships];

    res.status(200).json({ 
      success: true, 
      appliedJobs: allApplications 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications", error: err.message });
  }
});

export default router;