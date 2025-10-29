const express = require("express");
const router = express.Router();
const {
    generateCertificate,
    verifyCertificate,
    getUserCertificates,
    downloadCertificate,
} = require("../controllers/certificate");
const { protect } = require("../middlewares/index");

router.post("/generate", protect, generateCertificate);
router.get("/verify", verifyCertificate); // Public
router.get("/my-certificates", protect, getUserCertificates);
router.get("/:certificateId/download", protect, downloadCertificate);

module.exports = router;
