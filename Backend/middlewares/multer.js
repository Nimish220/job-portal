// import multer from "multer";
// import path from "path";
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "application/pdf",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only .pdf and .docx files are allowed"), false);
//     }
//   },
// });

// export default upload;

import multer from "multer";
import pkg from "multer-storage-cloudinary";
const CloudinaryStorage = pkg.CloudinaryStorage || pkg;
import cloudinary from "../config/cloudinaryConfig.js"; // import your cloudinary config

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resumes", // Cloudinary folder
    resource_type: "auto", // because .pdf and .docx are not images
    access_mode: "public", // ✅ REQUIRED for open access via URL
    format: async (req, file) => {
      return file.originalname.split(".").pop(); // keep original file extension
    },
    // public_id: (req, file) => {
    //   return file.originalname.split(".")[0]; // filename without extension
    // },
    public_id: (req, file) => {
      const name = file.originalname.split(".")[0];
      return `${name}_${Date.now()}`; // 👈 add timestamp
    },
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png"
];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf and .docx files are allowed"), false);
    }
  },
});

export default upload;
