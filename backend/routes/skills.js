const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getAvailableSkills,
    createSkill,
    updateSkill,
} = require("../controllers/skills");

// All routes are protected and require admin role
router.use(protect);
router.use(checkRoles(["admin", "superAdmin"]));

// Get available skills for course assignment
router.get("/available", getAvailableSkills);

router.post("/", createSkill);
router.put("/:id", updateSkill);

module.exports = router;
