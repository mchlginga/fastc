const express = require("express");
router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");

const { getCompletions, createCompletions } = require("../controllers/completion");

router.get("/", protect, getCompletions);
router.post("/", protect, createCompletions);

module.exports = router;