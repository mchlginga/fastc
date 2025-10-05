const express = require("express");
const router = express.Router();
const { protect, checkRoles, upload } = require("../middlewares/index");
const {
    createUser,
    getProfile,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    updateProfile,
    reviewProfile,
    getPendingProfiles,
    getOnlineUsers,
    updateLastActive,
} = require("../controllers/user");

router.patch("/profile", protect, upload.array("proofs", 10), updateProfile);
router.post("/", protect, checkRoles(["superAdmin", "admin"]), createUser);
router.get("/profile", protect, getProfile);
router.get("/", protect, checkRoles(["superAdmin", "admin"]), getUsers);
router.get(
    "/:id",
    protect,
    checkRoles(["superAdmin", "admin", "company"]),
    getUserById
);
router.patch(
    "/:id",
    protect,
    checkRoles(["superAdmin", "admin"]),
    updateUserById
);
router.patch(
    "/:id/review",
    protect,
    checkRoles(["superAdmin", "admin"]),
    reviewProfile
);
router.delete(
    "/:id",
    protect,
    checkRoles(["superAdmin", "admin"]),
    deleteUserById
);
router.get(
    "/profile-review",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getPendingProfiles
);
router.get(
    "/online",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getOnlineUsers
);
router.patch("/last-active", protect, updateLastActive);

module.exports = router;
