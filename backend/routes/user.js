const express = require("express");
const router = express.Router();
const { protect, checkRoles, upload } = require("../middlewares/index");
const { updateProfile } = require("../controllers/profiling");
const {
    getUserProfile,
    updateUserProfile,
    changePassword,
} = require("../controllers/user");
const { uploadProfilePic, removeProfilePic } = require("../controllers/upload");
const {
    updateEducation,
    updateCertificates,
} = require("../controllers/educationCertificate");

// user.js
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// upload.js
router.post(
    "/upload/profile-pic",
    protect,
    upload.single("profilePic"),
    uploadProfilePic
);
router.delete("/remove/profile-pic", protect, removeProfilePic);

// profiling.js
router.patch(
    "/profile/setup",
    protect,
    upload.array("files", 10),
    updateProfile
);

router.patch("/education", protect, upload.array("files", 10), updateEducation);

router.patch(
    "/certificates",
    protect,
    upload.array("files", 10),
    updateCertificates
);

router.put("/change-password", protect, changePassword);

module.exports = router;
