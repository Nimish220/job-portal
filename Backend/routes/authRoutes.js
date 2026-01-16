// Adding this new Route for role based page restricitons. (By-Tushar)
import express from "express";
import { User } from "../models/User.js";
import { Recruiter } from "../models/Recruiter.js";
import { protect } from "../middlewares/authMiddleware.js";  
import { silentCheck } from
 "../middlewares/authMiddleware.js";
const router = express.Router();

/*router.get("/check", protect, async (req, res) => {
  try {
    if (req.user?.role === "Seeker") {
      return res.json({ authenticated: true, role: "user" });
    }

    if (req.recruiter?.role === "Recruiter") {
      return res.json({ authenticated: true, role: "recruiter" });
    }

    return res.status(403).json({ message: "User role not found" });
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});*/

router.get("/check", silentCheck);

export default router;
