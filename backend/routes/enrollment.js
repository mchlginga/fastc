// routes/enrollment.js
const express = require("express");
const router = express.Router();
const {
    enrollInCourse,
    getUserEnrollments,
    getEnrollmentDetails,
    cancelEnrollment,
    completeLesson,
} = require("../controllers/enrollment");
const { protect } = require("../middlewares/index");

router.post("/enroll", protect, enrollInCourse);
router.get("/my-enrollments", protect, getUserEnrollments);
router.get("/:enrollmentId", protect, getEnrollmentDetails);
router.patch("/:enrollmentId/cancel", protect, cancelEnrollment);
router.post("/:enrollmentId/complete-lesson", protect, completeLesson);

module.exports = router;
