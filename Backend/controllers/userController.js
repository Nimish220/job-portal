import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Job } from "../models/Job.js";
import { Internship } from "../models/Internship.js";
import { uploadToCloudinary } from "../config/cloudinaryConfig.js";
import crypto from 'crypto'; //  this for the token generation
import { sendEmail } from '../utils/sendEmail.js'; //  this for Brevo

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ success: false,message: "User not found" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour but in cookie form
    });
    console.log('User login successful');
    res.status(200).json({
      success: true,
      token,
      message: "User login successful",
      user: {
        name: existingUser.name,
        email: existingUser.email,
        id: existingUser._id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const editProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     console.log(user);
//     const fields = ({ name, github, degree, university, email, city, about } =
//       req.body);
//     const updatedFields = [
//       "name",
//       "github",
//       "degree",
//       "city",
//       "university",
//       "email",
//       "about",
//     ];
//     console.log(req.body.github);

//     updatedFields.forEach((field) => {
//       if (req.body[field]) {
//         user[field] = req.body[field];
//       }
//     });

//     await user.save();

//     res
//       .status(200)
//       .json({ success: true, message: "User profile edited successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error });
//     console.log(error);
//   }
// };

// export const editProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const updatedFields = [
//       "name",
//       "github",
//       "degree",
//       "university",
//       "email",
//       "city",
//       "about",
//       "skills",
//       "experience", // Added experience field
//     ];

//     updatedFields.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         user[field] = req.body[field];
//       }
//     });

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "User profile edited successfully",
//     });
//   } catch (error) {
//     console.log("Edit profile error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

export const editProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fieldsToUpdate = [
      "name",
      "github",
      "degree",
      "city",
      "university",
      "email",
      "about",
      "skills",
      "experience",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({ success: true, message: "Profile updated", experience: user.experience });
  } catch (error) {
    console.error("Edit Profile Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const userlogout = async (req, res) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('recruiter', 'companyName');
    if (jobs.length === 0) {
      return res.status(203).json({ message: "No Active jobs" });
    }
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

import { Notification } from "../models/Notification.js";

export const applyToJobs = async (req, res) => {
  try {
    // Debug logs to verify incoming data
    //console.log("=== APPLY TO JOB REQUEST ===");
    //console.log("Body:", req.body);
    //console.log("File:", req.file);

    // 1. Extract Job ID from body (matches your frontend idKey logic)
    const jobId = req.body?.jobId || req.body?.id || req.body?.job_id;
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required." });
    }

    // 2. Validate Job existence and status
    const job = await Job.findById(jobId).populate('recruiter');
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.status === "closed") {
      return res.status(403).json({ message: "Job Opening is closed" });
    }

    // 3. Validate User existence (req.user from authMiddleware)
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 4. Check if user has already applied
    const alreadyApplied = job.candidates.some(
      (id) => id.toString() === user._id.toString()
    );
    if (alreadyApplied) {
      return res.status(403).json({ message: "Already applied to this job" });
    }

    // 5. Handle File Upload using Buffer (Multer Memory Storage)
    let resumeData = null;
    if (req.file && req.file.buffer) {
      try {
        // Upload to Cloudinary using the shared helper
        const uploadedUrl = await uploadToCloudinary(req.file.buffer, "user_resumes");

        // Prepare the object to match your User Schema resume array
        resumeData = {
          fileName: req.file.originalname,
          fileUrl: uploadedUrl,
          uploadedAt: new Date()
        };

        // Push to user's resume array
        user.resume.push(resumeData);
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ message: "Failed to upload resume to Cloudinary" });
      }
    } else {
       return res.status(400).json({ message: "Resume file is required" });
    }

    // 6. Update Job and User records
    job.candidates.push(user._id);
    user.appliedJobs.push(job._id);

    await job.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });

    // 7. Send notification to recruiter
    if (job.recruiter && job.recruiter._id) {
      await Notification.create({
        recipient: job.recruiter._id,
        recipientModel: "Recruiter",
        sender: user._id,
        senderModel: "User",
        type: "job_applied",
        message: `${user.name} applied for your job: ${job.jobRole || job.title}`,
        job: job._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applied To Job successfully",
      resume: resumeData,
    });
  } catch (error) {
    console.error("ApplyToJobs Error:", error);
    res.status(500).json({ error: error.message, message: "Server error during application" });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    // Nested Populate: User -> Job -> Recruiter
    const user = await User.findById(userId)
      .populate({
        path: "appliedJobs",
        populate: {
          path: "recruiter",
          select: "companyName" // Only get the company name
        }
      })
      .populate({
        path: "appliedInternships",
        populate: {
          path: "recruiter",
          select: "companyName"
        }
      });
    //console.log(user?.appliedJobs);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.appliedJobs.length === 0 || !user) {
      return res.status(203).json({
        success: false,
        message: "You haven't applied to any jobs yet.",
        appliedJobs: [],
      });
    }
    return res.status(200).json({ 
      success: true, 
      appliedJobs: user.appliedJobs || [], 
      appliedInternships: user.appliedInternships || [] 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// export const getCurrentUser = async (req, res) => {
//   try {
//     const user = req.user;
//     res.status(200).json({
//       success: true,
//       user: {
//         name: user.name,
//         email: user.email,
//         id: user._id,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
        degree: user.degree,
        city: user.city,
        university: user.university,
        github: user.github,
        about: user.about,
        skills: user.skills,
        experience: user.experience,
      },
    });
  } catch (err) {
    res.status(500).json({ message: unauthenticated });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id; // from protect middleware

    await User.findByIdAndUpdate(userId, {
      $pull: { savedJobs: jobId }
    });

    res.json({ success: true, message: "Job removed from saved jobs" });
  } catch (error) {
    console.error("Error removing saved job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getInternships = async (req, res) => {
  try {
    // Populate the recruiter field to get companyName
    const internships = await Internship.find()
      .populate("recruiter", "companyName"); // Only fetch companyName from recruiter

    if (internships.length === 0) {
      return res.status(203).json({ message: "No active internships" });
    }

    return res.status(200).json({ success: true, internships });
  } catch (error) {
    console.error("Get internships error:", error);
    res.status(500).json({ error: error.message });
  }
};
//  Get internship by ID
export const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate(
      "recruiter",
      "companyName email"
    );
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: "Error fetching internship", error: err.message });
  }
};

// Get internship workflow (if you want a separate workflow endpoint like jobs)
export const getInternshipWorkflow = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.json({
      workflowSteps: internship.workflowSteps || [
        "Application Submitted",
        "Resume Shortlisting",
        "Interview",
        "Offer",
      ],
      status: internship.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching workflow", error: err.message });
  }
};

export const applyToInternships = async (req, res) => {
    try {
        // 1. Extract Internship ID from body
        const { internshipId } = req.body; 
        
        // 2. Find the Internship and populate the Recruiter for notification
        const internship = await Internship.findById(internshipId).populate('recruiter');
        if (!internship) return res.status(404).json({ message: "Internship not found" });

        // 3. Check if the internship is open
        if (internship.status === "closed")
            return res.status(403).json({ message: "Internship opening is closed" });

        // 4. Validate User existence (req.user from authMiddleware)
        const user = await User.findById(req.user._id); 
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // 5. Check for duplicate application
        const alreadyApplied = internship.candidates.includes(user._id);
        if (alreadyApplied)
            return res.status(403).json({ message: "Already applied to this internship" });
        // Ensure you are pushing to appliedInternships, NOT appliedJobs
        //user.appliedInternships.push(internshipId);
        //await user.save({ validateBeforeSave: false });
        // 6. Handle File Upload using Buffer (Multer Memory Storage)
        let resumeData = null;
        if (req.file && req.file.buffer) {
            try {
                // Upload to Cloudinary using shared helper
                const uploadedUrl = await uploadToCloudinary(req.file.buffer, "user_resumes");

                // Prepare object for User Schema resume array
                resumeData = {
                    fileName: req.file.originalname,
                    fileUrl: uploadedUrl,
                    uploadedAt: new Date()
                };

                // Add to user's resume list
                user.resume.push(resumeData);
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: "Failed to upload resume" });
            }
        } else {
            return res.status(400).json({ message: "Resume file is required" });
        }

        // 7. Perform the Application Update (Mongoose)
        internship.candidates.push(user._id);
        user.appliedInternships.push(internship._id);
        
        // Save both records
        await internship.save({ validateBeforeSave: false });
        await user.save({ validateBeforeSave: false });

        // 8. Send notification to recruiter
        if (internship.recruiter && internship.recruiter._id) {
            await Notification.create({
                recipient: internship.recruiter._id,
                recipientModel: "Recruiter",
                sender: user._id,
                senderModel: "User",
                type: "internship_applied",
                message: `${user.name} applied for your internship: ${internship.internshipRole || internship.title}`,
                internship: internship._id,
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Applied to Internship successfully",
            resume: resumeData 
        });
    } catch (error) {
        console.error("Apply to Internship Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Server error during application" 
        });
    }
};

export const forgotPassword = async (req, res) => {
    let user; // Define user outside so the catch block can see it
    //console.log("FORGOT PASSWORD HIT", req.body.email);
    try {
        const { email } = req.body;
        user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 

        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const message = `Click here to reset your password: ${resetUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message,
            resetUrl: resetUrl,
        });

        res.status(200).json({ success: true, message: `Email sent to ${email}` });
    } catch (error) {
        // Only try to clear fields if the user was actually found
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        // Hash the token from the URL to compare it with the DB
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() } // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Token is invalid or has expired." });
        }

        // Set new password (bcrypt hashing)
        user.password = await bcrypt.hash(req.body.password, 10);
        
        // Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful! You can now log in." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};