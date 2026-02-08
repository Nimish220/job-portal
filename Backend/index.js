import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import upload from "./routes/upload.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import { Job } from "./models/Job.js";
import { seeCandidates } from "./controllers/recruiterController.js";
import { protect, isRecruiter } from "./middlewares/authMiddleware.js";
import { User } from "./models/User.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { getInternships, getInternshipById } from "./controllers/userController.js";

dotenv.config();
const app = express();

app.set("trust proxy", 1);

//  Allow credentials and specific origins to resolve 403 Forbidden errors
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
    "http://localhost:5173", 
    "https://job-portal-frontend-two-kappa.vercel.app",
    "job-portal-frontend-dj473vbub-nimishs-projects-2486b21c.vercel.app"
  ];
      // 1. Allow requests with no origin (like mobile apps)
      // 2. Allow localhost for your local development
      // 3. Allow ANY subdomain ending in .vercel.app
      if (!origin || origin.startsWith("http://localhost") || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        // Blocks unauthorized domains for security
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Required for authentication cookies
    // ADD THIS LINE - If this is missing, mobile headers are ignored!
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || "a_very_long_random_string",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: "test" 
    }),
    cookie: {
        secure: true,      // Required for Vercel HTTPS
        sameSite: "none",  // Required for cross-domain
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));
//  FIXED: All middleware now uses the /v1 prefix to match the Frontend
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/applications", applicationRoutes);
app.use("/api/upload", upload);
app.use("/api/users/notifications", notificationRoutes);
app.use("/api/recruiters/notifications", notificationRoutes);

//  FIXED: Get all jobs route
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "companyName name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

//  FIXED: Get job by ID (Resolves the SyntaxError: Unexpected token '<')
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "companyName email");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
});

//  FIXED: Internship routes now versioned
app.get("/api/internships", getInternships);
app.get("/api/internships/:id", getInternshipById);

//  FIXED: Applicant details route versioned
app.get('/api/applicants/:applicantId', protect, isRecruiter, async (req, res) => {
  try {
    const user = await User.findById(req.params.applicantId)
      .select("name email photo degree university location github about skills experiences");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applicant", error: err.message });
  }
});

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello from versioned backend");
})

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(" Database Connection Error:", error);
    process.exit(1);
  });