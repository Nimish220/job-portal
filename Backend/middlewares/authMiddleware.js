import jwt from "jsonwebtoken";
import { Recruiter } from "../models/Recruiter.js";
import { User } from "../models/User.js";

// --- EXISTING PROTECT MIDDLEWARE (KEEPING FOR PRIVATE ROUTES) ---
export const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization Header FIRST (This is where your Interceptor puts it)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // 2. Check Cookies as a backup
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If still no token, it fails
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

export const silentCheck = async (req, res) => {
  try {
    let token;
    // 1. Check Authorization Header FIRST (This is where your Interceptor puts it)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // 2. Check Cookies as a backup
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If still no token, it fails
  if (!token) {
    return res.status(401).json({ success: false, message: "No session found" });
  }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Efficiently check both collections at once
    const [recruiter, user] = await Promise.all([
      Recruiter.findById(decoded.id).select("-password"),
      User.findById(decoded.id).select("-password")
    ]);

    if (recruiter) return res.status(200).json({ authenticated: true, role: "recruiter" });
    if (user) return res.status(200).json({ authenticated: true, role: "user" });

    return res.status(200).json({ authenticated: false, role: null });
  } catch (err) {
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