const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/index");
const { getCourses, getCourseById } = require("../controllers/course");

router.get("/", protect, getCourses);
router.get("/:id", protect, getCourseById);

module.exports = router;
