const express = require("express");
const router = express.Router();

const { protect, upload } = require("../middlewares/index");
const { uploadProfilePic } = require("../controllers/upload");

router.post("/upload-profile-pic", protect, upload.single("profile"), uploadProfilePic);

module.exports = router;