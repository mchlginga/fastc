const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getAttendanceRecords,
    getAttendanceRecordById,
    verifyAttendance,
    exportAttendance,
    getAttendanceStats,
} = require("../controllers/adminAttendance");

// Attendance management routes
router.get(
    "/attendance",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getAttendanceRecords
);
router.get(
    "/attendance/stats",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getAttendanceStats
);
router.get(
    "/attendance/export",
    protect,
    checkRoles(["superAdmin", "admin"]),
    exportAttendance
);

// Parameterized routes
router.get(
    "/attendance/:id",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getAttendanceRecordById
);
router.patch(
    "/attendance/:id/verify",
    protect,
    checkRoles(["superAdmin", "admin"]),
    verifyAttendance
);

module.exports = router;
