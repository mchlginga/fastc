const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/index");
const {
    verifyAttendance,
    markAttendance,
    enrollFace,
    getFaceStatus,
    getAttendanceHistory,
    getTodayAttendance,
} = require("../controllers/attendance");

router.post("/verify", protect, verifyAttendance);
router.post("/enroll", protect, enrollFace); // This is /attendance/enroll
router.get("/status", protect, getFaceStatus);
router.get("/history/:enrollmentId", protect, getAttendanceHistory);
router.get("/today/:courseId", protect, getTodayAttendance);
router.post("/mark", protect, markAttendance);

module.exports = router;
