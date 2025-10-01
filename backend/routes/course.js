const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/index");
const { getCourses } = require("../controllers/course");

router.get("/", protect, getCourses);

module.exports = router;
