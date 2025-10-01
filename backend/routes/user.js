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
} = require("../controllers/user");

router.patch("/profile", protect, upload.array("proofs", 10), updateProfile);
router.post("/", protect, checkRoles(["admin"]), createUser);
router.get("/profile", protect, getProfile);
router.get("/", protect, checkRoles(["admin"]), getUsers);
router.get("/:id", protect, checkRoles(["admin", "company"]), getUserById);
router.patch("/:id", protect, checkRoles(["admin"]), updateUserById);
router.patch("/:id/review", protect, checkRoles(["admin"]), reviewProfile);
router.delete("/:id", protect, checkRoles(["admin"]), deleteUserById);
router.get(
    "/profile-review",
    protect,
    checkRoles(["admin"]),
    getPendingProfiles
); // New endpoint for pending

module.exports = router;
