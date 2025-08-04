const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/index");
const { generateCert } = require("../controllers/certificate");

router.get("/", protect, generateCert);

module.exports = router;