const express = require("express");
const router = express.Router();
const {
    generateCertificate,
    verifyCertificate,
    getUserCertificates,
    downloadCertificate,
    viewCertificate,
    getCertificateUrl,
    directDownloadCertificate,
} = require("../controllers/certificate");
const { protect } = require("../middlewares/index");

router.post("/generate", protect, generateCertificate);
router.get("/verify", verifyCertificate); // Public
router.get("/my-certificates", protect, getUserCertificates);
router.get("/:certificateId/download", protect, downloadCertificate);
router.get("/:certificateId/view", protect, viewCertificate);
router.get("/:certificateId/url", protect, getCertificateUrl);
router.get(
    "/:certificateId/direct-download",
    protect,
    directDownloadCertificate
);

module.exports = router;
