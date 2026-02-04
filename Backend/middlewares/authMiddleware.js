import jwt from "jsonwebtoken";
import { Recruiter } from "../models/Recruiter.js";
import { User } from "../models/User.js";

// --- EXISTING PROTECT MIDDLEWARE (KEEPING FOR PRIVATE ROUTES) ---
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Cookies OR Authorization Header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Get token from "Bearer <token>"
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "No session found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [recruiter, user] = await Promise.all([
      Recruiter.findById(decoded.id).select("-password"),
      User.findById(decoded.id).select("-password")
    ]);

    if (recruiter) {
      req.user = recruiter;
      req.recruiter = recruiter;
      return next();
    }

    if (user) {
      req.user = user;
      return next();
    }

    return res.status(401).json({ message: "User no longer exists" });
  } catch (err) {
    return res.status(401).json({ message: "Session expired" });
  }
};

// --- NEW FUNCTION FOR SILENT CHECK (NO 403 RED ERRORS) ---
// This is specifically for your /auth/check route
export const silentCheck = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(200).json({ authenticated: false, role: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check Recruiter
    const recruiter = await Recruiter.findById(decoded.id).select("-password");
    if (recruiter) {
      return res.status(200).json({ authenticated: true, role: "recruiter" });
    }

    // Check User
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      return res.status(200).json({ authenticated: true, role: "user" });
    }

    return res.status(200).json({ authenticated: false, role: null });
  } catch (err) {
    // If token is invalid or expired, just return unauthenticated (no red errors)
    return res.status(200).json({ authenticated: false, role: null });
  }
};

export const isSeeker = async (req, res, next) => {
  // Use the user object already attached by the 'protect' middleware
  const user = req.user || (await User.findById(req.user?._id));

  //  FIX: Convert the role to lowercase before checking
  // This allows "Seeker", "seeker", or "SEEKER" to all pass.
  if (!user || !user.role || user.role.toLowerCase() !== "seeker") {
    return res.status(403).json({ 
      success: false,
      message: "Access denied: Not a seeker",
      debugRole: user?.role // Helpful to see what's actually in the DB
    });
  }

  req.user = user;
  next();
};
export const isRecruiter = async (req, res, next) => {
  const recruiter = req.recruiter || (await Recruiter.findById(req.user?._id));

  if (!recruiter || !recruiter.role || recruiter.role.toLowerCase() !== "recruiter") {
    return res.status(403).json({ message: "Access denied: Not a recruiter" });
  }

  req.recruiter = recruiter;
  next();
};