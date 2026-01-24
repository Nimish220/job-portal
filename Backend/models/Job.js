import mongoose from "mongoose";
import { Recruiter } from "./Recruiter.js";

const applicantSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
    appliedAt: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const jobSchema=new mongoose.Schema({
    hiringWorkflow: [{
        name: String,
        status: { type: String, enum: ['Pending', 'In-progress','Completed'], default: 'Pending' },
        dueDate: Date
      }],
    candidates:[{type:mongoose.Schema.ObjectId,ref:"User"}],
    recruiter:{type:mongoose.Schema.Types.ObjectId,ref:"Recruiter"},
    ctc:{type:String,required:true},
    requiredDocuments:{type:String,required:true},
    eligibilityCriteria:{type:String,required:true},
    skillsRequired:{type:String,required:true},
    jobRole:{type:String,required:true},
    jobDescription:{type:String,required:true},
    jobDescriptionDocument: { type: String },
    experience: {type: String, required: true},
    qualifications: {type: String, required: true},
    jobType: {type: String, enum: ['Full-Time', 'Part-Time'], default: 'Full-Time'},
    // attachedDocs: [{
    //   fileName: String,
    //   fileType: String,
    //   fileSize: Number,
    //   url: String, // e.g., local path or cloud storage URL
    //   uploadedAt: { type: Date, default: Date.now }
    // }],
    location:{type:String,required:true},
    status:{type:String,enum:['closed','open'],default:"open"}
    
})


export const Job=mongoose.model('Job',jobSchema)