// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Define storage folder
// const uploadDir = path.join(process.cwd(), "uploads", "employees");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .jpg, .jpeg, .png, and .webp formats allowed"), false);
//   }
// };

// export const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
//   fileFilter,
// });


import multer from "multer";
import path from "path";
import fs from "fs";

// -------------------------------
// 🔹 Employee Image Upload Setup
// -------------------------------
const imageUploadDir = path.join(process.cwd(), "uploads", "employees");
if (!fs.existsSync(imageUploadDir)) {
  fs.mkdirSync(imageUploadDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only .jpg, .jpeg, .png, and .webp formats allowed"), false);
};

export const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter,
});

// -------------------------------
// 🔹 Employee Document Upload Setup
// -------------------------------
const docUploadDir = path.join(process.cwd(), "uploads", "employee_docs");
if (!fs.existsSync(docUploadDir)) {
  fs.mkdirSync(docUploadDir, { recursive: true });
}

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, docUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}_${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

const docFileFilter = (req, file, cb) => {
  const allowedDocs = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedDocs.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF, DOC, DOCX, JPG, PNG allowed"), false);
};

export const uploadEmployeeDoc = multer({
  storage: docStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB per file
  fileFilter: docFileFilter,
});

