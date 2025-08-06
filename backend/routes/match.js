const express = require("express");
const router = express.Router();

const { protect, checkRoles } = require("../middlewares/index");
const { getUserMatchtoJob } = require("../controllers/match");

router.get("/:id", protect, checkRoles(["admin", "company"]), getUserMatchtoJob);

module.exports = router;