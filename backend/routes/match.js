const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const { getJobMatches, logCsvExport } = require("../controllers/match");

router.get(
    "/matches",
    protect,
    checkRoles(["superAdmin", "admin", "company"]),
    getJobMatches
);

router.post(
    "/log-export",
    protect,
    checkRoles(["superAdmin", "admin", "company"]),
    logCsvExport
);

module.exports = router;
