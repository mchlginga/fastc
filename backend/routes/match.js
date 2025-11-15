const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getJobMatches,
    logCsvExport,
    getMatchingStats,
} = require("../controllers/match");

// All routes are protected
router.use(protect);

// Admin and superAdmin routes
router.get(
    "/matches",
    checkRoles(["superAdmin", "admin", "company"]),
    getJobMatches
);
router.get(
    "/stats",
    checkRoles(["superAdmin", "admin", "company"]),
    getMatchingStats
);
router.post(
    "/log-export",
    checkRoles(["superAdmin", "admin", "company"]),
    logCsvExport
);

module.exports = router;
