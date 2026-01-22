import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // enum: ["Seeker", "Recruiter"],
      default: "Seeker",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    university: { type: String },
    city: { type: String },
    degree: { type: String },
    github: { type: String },
    about: { type: String },
    skills: [{ type: String }],
    experience: { type: String },
    profilePhoto: { type: String },
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
      appliedInternships: [
    { type: mongoose.Schema.Types.ObjectId,
      ref: "Internship" },
  ],

    //  Add this resume field here:
    resume: [
      {
        fileName: String,
        fileUrl: String,
        publicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

// export const User = mongoose.model("User", userSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
