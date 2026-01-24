
import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  internshipRole: { type: String, required: true },
  jobDescription: { type: String }, 
  internshipDescriptionDocument: { type: String },
  stipendType: { type: String, enum: ["Fixed", "Performance Based", "Unpaid"], required: true },
  stipendAmount: { type: String },
  skillsRequired: { type: String },
  internshipType: { type: String, enum: ["Full-Time", "Part-Time"], required: true },
  internshipDuration: { type: String },
  location: { type: String },
  eligibilityCriteria: { type: String },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" }, // optional
  status: { type: String, enum: ['closed','open'], default: "open" },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}, { timestamps: true });

export const Internship = mongoose.model("Internship", internshipSchema);