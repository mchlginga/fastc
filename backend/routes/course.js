const express = require("express");
const router = express.Router();

const { protect, checkRoles} = require("../middlewares/index");
const { createCourse, getCourse } = require("../controllers/course");

router.post("/", protect, checkRoles("admin"), createCourse);
router.get("/", protect, checkRoles("admin"), getCourse);

module.exports = router;