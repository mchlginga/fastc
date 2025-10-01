const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/index");
const {
    generateCertificate,
    getCertificates,
} = require("../controllers/certificate");

router.get("/", protect, generateCertificate);
router.get("/certificates", protect, getCertificates);

module.exports = router;
