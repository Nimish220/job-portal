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

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB Limit
  fileFilter: (req, file, cb) => {
    // STRICT CHECK: Only allow application/pdf
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Strictly only PDF files are allowed!"), false);
    }
  },
});
export const uploadImage = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB for photos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpg, png, etc.) are allowed!"), false);
    }
  },
});

export default upload;