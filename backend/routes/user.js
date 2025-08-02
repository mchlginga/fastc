const express = require("express");
const router = express.Router();

const { 
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById
} = require("../controllers/user");

const { protect, checkRoles } = require("../middlewares/index");

router.get("/", protect, checkRoles("admin"), getUsers);

router.get("/:id", protect, checkRoles([ "admin", "company" ]), getUserById);

router.put("/:id", protect, checkRoles([ "admin", "trainee" ]), updateUserById);

router.delete("/:id", protect, checkRoles("admin"), deleteUserById);

module.exports = router;