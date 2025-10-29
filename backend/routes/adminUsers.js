const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getUsers,
    getUserById,
    updateUserStatus,
    bulkUpdateUserStatus,
    createUser,
    updateUser,
    deleteUser,
} = require("../controllers/adminUsers");

// All routes are protected and require admin role
router.use(protect);
router.use(checkRoles(["admin", "superAdmin"]));

// Get all users with filters
router.get("/users", getUsers);

// Get specific user
router.get("/users/:id", getUserById);

// Create new user
router.post("/users", createUser);

// Update user status
router.patch("/users/:id/status", updateUserStatus);

// Bulk update user status
router.patch("/users/bulk/status", bulkUpdateUserStatus);

// Update user details
router.put("/users/:id", updateUser);

// Delete user
router.delete("/users/:id", deleteUser);

module.exports = router;
