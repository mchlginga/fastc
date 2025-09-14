const express = require("express");
const router = express.Router();

const { protect, checkRoles } = require("../middlewares/index");
const { 
    getProfile,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById
} = require("../controllers/user");

router.get("/profile", protect, getProfile);
router.get("/", protect, checkRoles("admin"), getUsers);
router.get("/:id", protect, checkRoles([ "admin", "company" ]), getUserById);
router.put("/:id", protect, checkRoles("admin"), updateUserById);
router.delete("/:id", protect, checkRoles("admin"), deleteUserById);

module.exports = router;