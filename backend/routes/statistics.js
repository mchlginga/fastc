const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getDashboardStats,
    getRecentActivities,
    getSystemOverview,
    getOnlineUsers
} = require("../controllers/statistics");

// All routes are protected and require admin role
router.use(protect);
router.use(checkRoles(["admin", "superAdmin"]));

// Dashboard statistics
router.get("/dashboard", getDashboardStats);

// Recent activities
router.get("/activities", getRecentActivities);

// System overview
router.get("/overview", getSystemOverview);

// Online users
router.get("/online-users", getOnlineUsers);

module.exports = router;