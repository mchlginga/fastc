const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/index");
const {
    createCertificate,
    getCertificates,
    downloadCertificate,
} = require("../controllers/certificate");

router.post("/", protect, createCertificate);
router.get("/", protect, getCertificates);
router.get("/download/:certificateId", protect, downloadCertificate);

module.exports = router;
