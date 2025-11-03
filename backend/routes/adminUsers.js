const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getUsers,
    getUserById,
    createUser,
    updateUserStatus,
    bulkUpdateUserStatus,
    updateUser,
    deleteUser,
} = require("../controllers/adminUsers");

// User management routes - SPECIFIC ROUTES FIRST
router.get("/users", protect, checkRoles(["superAdmin", "admin"]), getUsers);
router.post("/users", protect, checkRoles(["superAdmin", "admin"]), createUser);

// BULK ROUTES - MUST COME BEFORE PARAMETERIZED ROUTES
router.patch(
    "/users/bulk/status",
    protect,
    checkRoles(["superAdmin", "admin"]),
    bulkUpdateUserStatus
);

// PARAMETERIZED ROUTES - MUST COME AFTER SPECIFIC ROUTES
router.get(
    "/users/:id",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getUserById
);
router.patch(
    "/users/:id/status",
    protect,
    checkRoles(["superAdmin", "admin"]),
    updateUserStatus
);
router.put(
    "/users/:id",
    protect,
    checkRoles(["superAdmin", "admin"]),
    updateUser
);
router.delete(
    "/users/:id",
    protect,
    checkRoles(["superAdmin", "admin"]),
    deleteUser
);

module.exports = router;
