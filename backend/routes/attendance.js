const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/index");
const {
    verifyAttendance,
    markAttendance,
} = require("../controllers/attendance");

router.post("/verify", protect, verifyAttendance);
/* router.get("/history/:enrollmentId", protect, getAttendanceHistory); */
router.post("/mark", protect, markAttendance);

module.exports = router;
