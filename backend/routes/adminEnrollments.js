const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getEnrollments,
    getEnrollmentById,
    updateEnrollmentStatus,
    bulkUpdateEnrollmentStatus,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getEnrollmentStats,
    getCourseEnrollments,
    getUserEnrollments,
    updateEnrollmentProgress,
} = require("../controllers/adminEnrollments");

// All routes are protected and require admin role
router.use(protect);
router.use(checkRoles(["admin", "superAdmin"]));

// Get all enrollments with filters
router.get("/enrollments", getEnrollments);

// Get enrollment statistics
router.get("/enrollments/stats", getEnrollmentStats);

// Create new enrollment (manual enrollment by admin)
router.post("/enrollments", createEnrollment);

router.patch("/enrollments/bulk/status", bulkUpdateEnrollmentStatus);

// Get specific enrollment
router.get("/enrollments/:id", getEnrollmentById);

// Update enrollment status
router.patch("/enrollments/:id/status", updateEnrollmentStatus);

// Update enrollment progress
router.patch("/enrollments/:id/progress", updateEnrollmentProgress);

// Update enrollment details
router.put("/enrollments/:id", updateEnrollment);

// Delete enrollment
router.delete("/enrollments/:id", deleteEnrollment);

// Get course enrollments
router.get("/courses/:courseId/enrollments", getCourseEnrollments);

// Get user enrollments
router.get("/users/:userId/enrollments", getUserEnrollments);

module.exports = router;
