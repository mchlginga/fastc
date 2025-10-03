const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/index");
const {
    getCompletions,
    createCompletions,
    completeLesson,
    markAttendance,
} = require("../controllers/completion");

router.get("/", protect, getCompletions);
router.post("/", protect, createCompletions);
router.post("/complete", protect, completeLesson);
router.post("/attendance", protect, markAttendance);

module.exports = router;
