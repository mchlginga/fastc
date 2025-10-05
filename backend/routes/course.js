const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getCourses,
    getCourseById,
    getActiveCourses,
    getActiveCoursesCount,
} = require("../controllers/course");

router.get("/", protect, getCourses);
router.get("/:id", protect, getCourseById);
router.get(
    "/active",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getActiveCourses
);
router.get(
    "/active/count",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getActiveCoursesCount
);

module.exports = router;
