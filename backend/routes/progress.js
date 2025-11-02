// routes/progress.js
const express = require("express");
const router = express.Router();
const {
    completeLesson,
    updateLastAccessed,
    getCourseProgress,
    bulkCompleteLessons,
} = require("../controllers/progress");
const { protect } = require("../middlewares/index");

router.post("/complete-lesson", protect, completeLesson);
router.post("/update-access", protect, updateLastAccessed);
router.get("/:enrollmentId", protect, getCourseProgress);
router.post("/bulk-complete", protect, bulkCompleteLessons); // Admin only

module.exports = router;
