import jwt from "jsonwebtoken";
import { Recruiter } from "../models/Recruiter.js";
import { User } from "../models/User.js";

// export const protect = async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(403).json({ message: "No token provided" });

//   try {
//     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // console.log(decoded)

//     // req.user = decoded;
//     // req.user = await User.findById(decoded.id);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };
/*
export const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check recruiter first
    const recruiter = await Recruiter.findById(decoded.id).select("-password");
    if (recruiter) {
      req.user = recruiter;
      req.recruiter = recruiter;
      return next();
    }

    // If needed, check User
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
      return next();
    }

    return res.status(401).json({ message: "User not found" });
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};



export const isRecruiter = async (req, res, next) => {
  // Ensure user exists first
  if (!req.recruiter) {
    return res.status(401).json({ message: "Not authorized, user missing" });
  }

  // Check if recruiter already attached
  let recruiter = req.recruiter;
  if (!recruiter) {
    recruiter = await Recruiter.findById(req.user._id);
  }

  if (!recruiter || recruiter.role !== "Recruiter") {
    return res.status(403).json({ message: "Access denied: Not a recruiter" });
  }

  req.recruiter = recruiter;
  next();
};


export const isSeeker = async (req, res, next) => {
  const user = req.user || await User.findById(req.user?._id);

  if (!user || user.role !== "Seeker") {
    return res.status(403).json({ message: "Access denied: Not a seeker" });
  }

  req.user = user;
  next();
};

*/

// --- EXISTING PROTECT MIDDLEWARE (KEEPING FOR PRIVATE ROUTES) ---
export const protect = async (req, res, next) => {
  const token = req.cookies.token;
  
  // Change 403 to 401 (Unauthorized) - 403 usually implies you're logged in but banned
  if (!token) return res.status(401).json({ success: false, message: "No session found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try finding in both collections simultaneously to speed up refresh response
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
/*
export const isRecruiter = async (req, res, next) => {
  if (!req.recruiter) {
    return res.status(401).json({ message: "Not authorized, user missing" });
  }

  let recruiter = req.recruiter;
  if (!recruiter) {
    recruiter = await Recruiter.findById(req.user._id);
  }

  if (!recruiter || recruiter.role !== "Recruiter") {
    return res.status(403).json({ message: "Access denied: Not a recruiter" });
  }

  req.recruiter = recruiter;
  next();
};

export const isSeeker = async (req, res, next) => {
  const user = req.user || (await User.findById(req.user?._id));

  if (!user || user.role !== "Seeker") {
    return res.status(403).json({ message: "Access denied: Not a seeker" });
  }

  req.user = user;
  next();
};*/

export const isSeeker = async (req, res, next) => {
  // Use the user object already attached by the 'protect' middleware
  const user = req.user || (await User.findById(req.user?._id));

  // ✅ FIX: Convert the role to lowercase before checking
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