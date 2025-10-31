const express = require("express");
const router = express.Router();
const { protect, checkRoles, uploadCourse } = require("../middlewares/index");
const {
    getCourses,
    getCourseById,
    updateCourseStatus,
    bulkUpdateCourseStatus,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseStats,
    uploadCourseImage,
    removeCourseImage,
} = require("../controllers/adminCourses");

// All routes are protected and require admin role
router.use(protect);
router.use(checkRoles(["admin", "superAdmin"]));

// Get all courses with filters
router.get("/courses", getCourses);

// Get course statistics
router.get("/courses/stats", getCourseStats);

// Get specific course
router.get("/courses/:id", getCourseById);

// Create new course
router.post("/courses", uploadCourse.single("image"), createCourse);

// Update course details
router.put("/courses/:id", uploadCourse.single("image"), updateCourse);

// Bulk update course status
router.patch("/courses/bulk/status", bulkUpdateCourseStatus);

// Update course status
router.patch("/courses/:id/status", updateCourseStatus);

// Delete course
router.delete("/courses/:id", deleteCourse);

// Upload course image
router.post(
    "/courses/:id/image",
    uploadCourse.single("image"),
    uploadCourseImage
);

// Remove course image
router.delete("/courses/:id/image", removeCourseImage);

module.exports = router;
