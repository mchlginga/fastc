const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getDashboardStats,
    getOnlineUsers,
    getRecentActivities,
    getExportHistory,
} = require("../controllers/statistics");

// All routes require superAdmin or admin role
router.get(
    "/dashboard",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getDashboardStats
);
router.get(
    "/online-users",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getOnlineUsers
);
router.get(
    "/recent-activities",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getRecentActivities
);
router.get(
    "/export-history",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getExportHistory
);

module.exports = router;
