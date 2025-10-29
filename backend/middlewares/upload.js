const multer = require("multer");
const ensureDirExist = require("../utils/ensureDirExist");
const { PATHS } = require("../utils/constant");

ensureDirExist(PATHS.profileDir);
ensureDirExist(PATHS.courseDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATHS.profileDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const courseStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATHS.courseDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, and PDF files are allowed."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadCourse = multer({
    storage: courseStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = { upload, uploadCourse };
