const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");

const { getCompletions, createCompletions } = require("../controllers/completion");

router.get("/", protect, getCompletions);
router.post("/", protect, checkRoles("admin"), createCompletions);

module.exports = router;