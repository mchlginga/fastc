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
router.get("/matches", checkRoles(["superAdmin", "admin"]), getJobMatches);
router.get("/stats", checkRoles(["superAdmin", "admin"]), getMatchingStats);
router.post("/log-export", checkRoles(["superAdmin", "admin"]), logCsvExport);

// Company routes (similar functionality but for company perspective)
router.get("/company/matches", checkRoles(["company"]), getJobMatches);
router.post("/company/log-export", checkRoles(["company"]), logCsvExport);

module.exports = router;
