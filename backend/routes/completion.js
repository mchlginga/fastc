const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getCompletions,
    createCompletions,
    completeLesson,
    markAttendance,
    getTotalTrainees,
} = require("../controllers/completion");

router.get("/", protect, getCompletions);
router.post("/", protect, createCompletions);
router.post("/complete", protect, completeLesson);
router.post("/attendance", protect, markAttendance);
router.get(
    "/total-trainees",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getTotalTrainees
);

module.exports = router;
