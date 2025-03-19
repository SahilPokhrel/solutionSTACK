import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});

// File filter (only allow images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG images are allowed!"));
  }
};

// Configure multer
const upload = multer({ storage, fileFilter });

export default upload;
