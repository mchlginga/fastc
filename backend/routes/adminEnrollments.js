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
    approveEnrollment,
    bulkApproveEnrollments,
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

// BULK ROUTES - MUST BE BEFORE INDIVIDUAL ID ROUTES
router.patch("/enrollments/bulk/status", bulkUpdateEnrollmentStatus);
router.patch("/enrollments/bulk/approve", bulkApproveEnrollments);

// INDIVIDUAL ENROLLMENT ROUTES
router.get("/enrollments/:id", getEnrollmentById);
router.patch("/enrollments/:id/status", updateEnrollmentStatus);
router.patch("/enrollments/:id/approve", approveEnrollment);
router.patch("/enrollments/:id/progress", updateEnrollmentProgress);
router.put("/enrollments/:id", updateEnrollment);
router.delete("/enrollments/:id", deleteEnrollment);

// Get course enrollments
router.get("/courses/:courseId/enrollments", getCourseEnrollments);

// Get user enrollments
router.get("/users/:userId/enrollments", getUserEnrollments);

module.exports = router;
