const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for profile pictures
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "fastc/profiles",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});

// Storage for course files
const courseStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "fastc/courses", // Different folder for courses
        allowed_formats: ["jpg", "jpeg", "png", "pdf"], // Include PDF for courses
        transformation: [{ width: 800, height: 600, crop: "limit" }], // Different size for courses
    },
});

module.exports = { cloudinary, profileStorage, courseStorage };
