  import { Recruiter } from "../models/Recruiter.js";
  import cloudinary from "../config/cloudinaryConfig.js";
  import bcrypt from "bcryptjs";
  import crypto from 'crypto';
  import { sendEmail } from '../utils/sendEmail.js';
  import jwt from "jsonwebtoken";
  import { Job } from "../models/Job.js";
  import { Internship } from "../models/Internship.js";
  import { User} from "../models/User.js";
  import { Notification } from "../models/Notification.js";
  import { uploadToCloudinary } from "../config/cloudinaryConfig.js";
  // LOGIN RECRUITER
  export const loginRecruiter = async (req, res) => {
    const { email, password } = req.body;
    try {
      const recruiter = await Recruiter.findOne({ email });
      if (!recruiter)
        return res.status(404).json({ success: false,message: "Recruiter not found" });

      const isMatch = await bcrypt.compare(password, recruiter.password);
      if (!isMatch)
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

        /*res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to false for localhost http
        sameSite: "lax", 
        maxAge: 1 * 60 * 60 * 1000, 
      });*/
      //For Production
        res.cookie("token", token, {
        httpOnly: true,
        secure: true,      // Required for Vercel's HTTPS
        sameSite: "None",  // Required for cross-domain cookies
        maxAge: 1 * 60 * 60 * 1000, 
      });

      res.status(200).json({
        recruiter: {
          id: recruiter._id,
          email: recruiter.email,
          companyName: recruiter.companyName,
        },
        success: true,
        token,
        user: { name: recruiter.name, id: recruiter._id, role: recruiter.role },
        message: "Login successfully",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // --- NEW HELPER FUNCTION ---
/*const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "recruiter_docs", resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};*/

// REGISTER RECRUITER (Updated for Buffer)
export const registerRecruiter = async (req, res) => {
  try {
    const { email, phone, password, companyName } = req.body;
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter)
      return res.status(400).json({ message: "Recruiter already exists" });

    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "PAN or GST document is required" });

    // Upload buffer to Cloudinary
    const fileUrl = await uploadToCloudinary(req.file.buffer);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRecruiter = new Recruiter({
      email,
      phone,
      password: hashedPassword,
      companyName,
      companyPanCardOrGstFile: fileUrl, // Save the URL from Cloudinary
    });

    await newRecruiter.save();
    res.status(201).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// UPDATE RECRUITER PROFILE (Updated for Buffer)
export const updateRecruiterProfile = async (req, res) => {
  try {
    if (!req.recruiter) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updates = { ...req.body };

    if (req.file && req.file.buffer) {
      // Use helper to upload the buffer logged in your terminal
      const uploadedUrl = await uploadToCloudinary(req.file.buffer);
      updates.companyPanCardOrGstFile = uploadedUrl;
    }

    const updatedRecruiter = await Recruiter.findByIdAndUpdate(
      req.recruiter._id,
      updates,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      recruiter: updatedRecruiter,
      message: "Recruiter profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

  // GET RECRUITER PROFILE
  export const getProfile = async (req, res) => {
    try {
      const recruiter = req.recruiter;
      res
        .status(200)
        .json({ recruiter, message: "Recruiter Profile Fetched Successfully" });
    } catch (error) {
      console.error("Error fetching ", error);
      res.status(500).json({ message: "Server error while fetching profile" });
    }
  };

  // RECRUITER LOGOUT
  export const recruiterLogout = async (req, res) => {
    try {
      /*res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 1 * 60 * 60 * 1000, // 1 hour but in cookie form
      });*/
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,      // Required for Vercel's HTTPS
        sameSite: "none",  // Required for cross-domain cookies
        //maxAge: 1 * 60 * 60 * 1000, 
      });
      res.status(200).json({ message: "Logout Sucessfull" });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  };

  // POST JOB
  // export const postJob = async (req, res) => {
  //   try {
  //     const recruiter = req.recruiter;
  //     const newJob = await Job.create({
  //       recruiter: recruiter._id,
  //       ...req.body,
  //     });
  //     res.status(201).json({ message: "Job created successfully", job: newJob });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //     console.log(error);
  //   }
  // };

  export const postJob = async (req, res) => {
  //console.log("File detected:", req.file ? "YES" : "NO");
  //console.log("Body detected:", req.body);
  try {
    // 1. Prepare data object (Matches Internship logic)
   const recruiter = req.recruiter;
    let fileUrl = "";

    if (req.file) {
      fileUrl = await uploadToCloudinary(req.file.buffer, "job_docs");
    }

    // CREATE OBJECT MANUALLY TO PREVENT ORDER SHIFTING
    const jobData = {
      jobRole: req.body.jobRole,
      jobDescription: req.body.jobDescription,
      experience: req.body.experience,
      ctc: req.body.ctc,
      skillsRequired: req.body.skillsRequired,
      location: req.body.location,
      eligibilityCriteria: req.body.eligibilityCriteria,
      qualifications: req.body.qualifications,
      requiredDocuments: req.body.requiredDocuments,
      jobType: req.body.jobType,
      jobDescriptionDocument: fileUrl, 
      recruiter: recruiter._id
    };

    // 3. Save to MongoDB
    const newJob = await Job.create(jobData);

    // 4. Notifications
    const users = await User.find({}, "_id");
    const notifications = users.map(user => ({
      recipient: user._id,
      recipientModel: "User",
      sender: recruiter._id,
      senderModel: "Recruiter",
      type: "job_posted",
      message: `New job posted: ${newJob.jobRole} by ${recruiter.companyName}`,
      job: newJob._id,
    }));
    await Notification.insertMany(notifications);

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ error: error.message });
  }
};

  // SEE CANDIDATES
  export const seeCandidates = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: 'candidates',
      select: 'name degree photo email', // select the fields you need
    })

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ candidates: job.candidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


  // UPDATE JOB
  export const updateJob = async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      const updates = { ...req.body };
      if (req.file) {
      // Use your existing helper to upload the new document
      const fileUrl = await uploadToCloudinary(req.file.buffer, "job_docs");
      updates.jobDescriptionDocument = fileUrl; // Add the Cloudinary URL to the update object
    }
      const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      updates,
      { new: true, runValidators: true }
    );

      res.status(200).json({ success: true, job: updatedJob });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const updateInternship = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      const fileUrl = await uploadToCloudinary(req.file.buffer, "internship_docs");
      updates.internshipDescriptionDocument = fileUrl;
    }
    const updated = await Internship.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, internship: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  // POST INTERNSHIP
  // export const postInternship = async (req, res) => {
  //   try {
  //     const recruiter = req.recruiter;
  //     const newInternship = await Internship.create({
  //       recruiter: recruiter._id,
  //       ...req.body,
  //     });
  //     res
  //       .status(201)
  //       .json({ message: "Internship created successfully", internship: newInternship });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };
  export const postInternship = async (req, res) => {
  try {
    const recruiter = req.recruiter;
    
    // 1. Prepare data object from req.body
    let internshipData = { 
        ...req.body, 
        recruiter: recruiter._id 
    };

    // 2. Handle file upload BEFORE saving to DB
    if (req.file) {
      const fileUrl = await uploadToCloudinary(req.file.buffer, "internship_docs");
      internshipData.internshipDescriptionDocument = fileUrl; 
    }

    // 3. Save to MongoDB
    const newInternship = await Internship.create(internshipData);

    // 4. Notifications logic (Keep your existing notification code here...)
    const users = await User.find({}, "_id");
    const notifications = users.map(user => ({
      recipient: user._id,
      recipientModel: "User",
      sender: recruiter._id,
      senderModel: "Recruiter",
      type: "internship_posted",
      message: `New internship: ${newInternship.internshipRole} by ${recruiter.companyName}`,
      internship: newInternship._id,
    }));
    await Notification.insertMany(notifications);

    res.status(201).json({ message: "Internship created successfully", internship: newInternship });
  } catch (error) {
    if (error.name === 'ValidationError') {
        // This extracts the specific missing fields from Mongoose
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ 
            success: false, 
            message: `Validation Error: ${messages.join(', ')}` 
        });
    }
    res.status(500).json({ error: error.message });
  }
};



  // DELETE JOB
  export const deleteJob = async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await Job.findByIdAndDelete(jobId);
      res
        .status(200)
        .json({ message: "Job Posting Deleted Successfully", job, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

 
  //  Get recruiter profile by ID
  export const getRecruiterProfile = async (req, res) => {
    try {
      const recruiter = await Recruiter.findById(req.params.id);
      if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
      res.json(recruiter);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // MY JOBS
  export const myJobs = async (req, res) => {
    try {
      const recruiter = req.recruiter;
      const jobs = await Job.find({ recruiter: recruiter._id });
      if (jobs.length === 0) {
        return res.status(203).json({ message: "No Jobs Posted by you", jobs: [] });
      }
      return res.status(200).json({ success: true, jobs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// GET CURRENT RECRUITER
export const getCurrentRecruiter = async (req, res) => {
  try {
    const recruiter = req.recruiter;
    res.status(200).json({
      success: true,
      recruiter: {
        name: recruiter.companyName,
        email: recruiter.email,
        id: recruiter._id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: unauthenticated });
  }
};

export const closeJob = async (req, res) => {
  try {
    // Find job by ID & recruiter (ownership check)
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.recruiter._id },
      { status: "closed" },
      { new: true, runValidators: false } // validation skip
    );

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not authorized" });
    }

    res.status(200).json({
      success: true,
      message: "Job closed successfully",
      job,
    });
  } catch (error) {
    console.error(" Error in closeJob:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const openJob = async (req, res) => {
  //   try {
  //     const jobId = req.params.id;
  //     const job = await Job.findById(jobId);
  //     job.status = "open";
  //     await job.save();
  //     res.status(200).json({ success: true, job });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //     console.log(error);
  //   }
  // };
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Recruiter owner check
    if (
      !req.recruiter ||
      job.recruiter.toString() !== req.recruiter._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to open this job" });
    }

    job.status = "open";
    await job.save({ validateModifiedOnly: true });

    res
      .status(200)
      .json({ success: true, message: "Job opened successfully", job });
  } catch (error) {
    console.error(" Error in openJob:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

  // Get all jobs posted by a recruiter
  export const getRecruiterJobs = async (req, res) => {
    try {
      const recruiterId = req.user.id; // recruiter logged in
      const jobs = await Job.find({ recruiter: recruiterId }).sort({ createdAt: -1 });

      res.status(200).json({jobs});
    } catch (error) {
      console.error("Error fetching recruiter jobs:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Get all jobs (for seekers to view)
  export const getAllJobs = async (req, res) => {
    try {
      const jobs = await Job.find()
        .populate("recruiter", "companyName recruiterName email") // show recruiter details if needed
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, jobs });
    } catch (error) {
      console.error("Error fetching all jobs:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const getRecruiterInternships = async (req, res) => {
  try {
    const recruiterId = req.recruiter._id;
    const internships = await Internship.find({ recruiter: recruiterId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({ internships });
  } catch (error) {
    console.error("Error fetching recruiter internships:", error);
    res.status(500).json({ message: "Server error" });
  }
};

  export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("recruiter", "companyName recruiterName email"); // ✅ populate recruiter details

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.status(200).json(job);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Invalid job ID format." });
    }
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
// GET all internships posted by logged-in recruiter



// CLOSE INTERNSHIP
export const closeInternship = async (req, res) => {
  try {
    const internship = await Internship.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.recruiter._id }, // check ownership
      { status: "closed" },
      { new: true, runValidators: false }
    );

    if (!internship) {
      return res.status(404).json({ message: "Internship not found or not authorized" });
    }

    res.status(200).json({
      success: true,
      message: "Internship closed successfully",
      internship,
    });
  } catch (error) {
    console.error(" Error in closeInternship:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// OPEN INTERNSHIP
export const openInternship = async (req, res) => {
  try {
    const internship = await Internship.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.recruiter._id }, // ownership check
      { status: "open" },
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({ message: "Internship not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Internship opened successfully",
      internship,
    });
  } catch (error) {
    console.error(" Error opening internship:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE INTERNSHIP
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findOneAndDelete({
      _id: req.params.id,
      recruiter: req.recruiter._id,
    });

    if (!internship) {
      return res.status(404).json({ message: "Internship not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully",
    });
  } catch (error) {
    console.error(" Error deleting internship:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCandidateProfile = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;

    // 1. Try to find the posting in the Job collection first
    let posting = await Job.findById(jobId).populate("candidates");
    
    // 2. If not found in Jobs, check the Internship collection
    if (!posting) {
      posting = await Internship.findById(jobId).populate("candidates");
    }

    // 3. If neither exists, return 404
    if (!posting) {
      return res.status(404).json({ message: "Job or Internship posting not found" });
    }

    // 4. Verify the applicant is actually part of this specific posting
    const isCandidate = posting.candidates.some(
      (c) => c._id.toString() === applicantId
    );
    
    if (!isCandidate) {
      return res.status(404).json({ message: "Candidate did not apply to this specific posting" });
    }

    // 5. Fetch full user details (this populates the missing About, Skills, Experience)
    const user = await User.findById(applicantId).select(
      "name email university city degree github about skills experience profilePhoto resume"
    );

    if (!user) {
      return res.status(404).json({ message: "User profile details not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(" Error in getCandidateProfile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 1. Find the recruiter (req.recruiter is provided by your 'protect' middleware)
    const recruiter = await Recruiter.findById(req.recruiter._id);

    // 2. Compare the current password entered with the hashed password in the database
    const isMatch = await bcrypt.compare(currentPassword, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // 3. Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update the password field and save
    recruiter.password = hashedPassword;
    await recruiter.save();

    res.status(200).json({ 
      success: true, 
      message: "Password updated successfully" 
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ success: false, message: "Server error while updating password" });
  }
};

// NEW: Notify a specific candidate about shortlisting
export const notifyApplicant = async (req, res) => {
  try {
    const { applicantId, jobId, message } = req.body;
    const recruiter = req.recruiter;

    if (!applicantId) {
      return res.status(400).json({ success: false, message: "Applicant ID is required" });
    }

    const newNotification = new Notification({
      recipient: applicantId,
      recipientModel: "User",
      sender: recruiter._id,
      senderModel: "Recruiter",
      type: "application_status", //  MATCHES enum in models/Notification.js
      message: message || `You have been shortlisted for the next round at ${recruiter.companyName}`,
      job: jobId,
      isRead: false 
    });

    await newNotification.save();
    res.status(200).json({ success: true, message: "Applicant notified successfully" });
  } catch (error) {
    console.error("Error in notifyApplicant:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const forgotPasswordRecruiter = async (req, res) => {
    let recruiter;
    try {
        const { email } = req.body;
        recruiter = await Recruiter.findOne({ email });

        if (!recruiter) {
            return res.status(404).json({ success: false, message: "Recruiter not found" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        recruiter.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        recruiter.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

        await recruiter.save({ validateBeforeSave: false });

        // Use a recruiter-specific route if your frontend handles them differently
        const resetUrl = `${process.env.FRONTEND_URL}/recruiters/reset-password/${resetToken}`;
        
        await sendEmail({
            email: recruiter.email,
            subject: 'Recruiter Password Reset Request',
            message: `Click here to reset your recruiter account password: ${resetUrl}`,
            resetUrl: resetUrl,
        });

        res.status(200).json({ success: true, message: `Reset link sent to ${email}` });
    } catch (error) {
        if (recruiter) {
            recruiter.resetPasswordToken = undefined;
            recruiter.resetPasswordExpire = undefined;
            await recruiter.save({ validateBeforeSave: false });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// backend/controllers/recruiterController.js

export const resetPasswordRecruiter = async (req, res) => {
    try {
        // 1. Hash the incoming plain-text token from the URL
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // 2. Find recruiter where hashed token matches AND hasn't expired
        const recruiter = await Recruiter.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() } // $gt means "Greater Than" now
        });

        if (!recruiter) {
            // This is likely why you get a 400
            return res.status(400).json({ 
                success: false, 
                message: "Token is invalid or has expired." 
            });
        }

        // 3. Hash the new password and save
        recruiter.password = await bcrypt.hash(req.body.password, 10);
        
        // 4. Clear reset fields so token can't be used again
        recruiter.resetPasswordToken = undefined;
        recruiter.resetPasswordExpire = undefined;

        await recruiter.save();

        res.status(200).json({ success: true, message: "Password reset successful!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};