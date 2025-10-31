const multer = require("multer");
const { profileStorage, courseStorage } = require("../config/cloudinary");

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, and PDF files are allowed."), false);
    }
};

const upload = multer({
    storage: profileStorage, // For profile pictures
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadCourse = multer({
    storage: courseStorage, // For course files
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { upload, uploadCourse };
