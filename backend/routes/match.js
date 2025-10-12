const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getJobMatches,
    addShortlist,
    removeShortlist,
    getShortlisted,
} = require("../controllers/match");

router.get(
    "/matches",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getJobMatches
);
router.post(
    "/shortlist",
    protect,
    checkRoles(["superAdmin", "admin"]),
    addShortlist
);
router.delete(
    "/shortlist/:traineeId",
    protect,
    checkRoles(["superAdmin", "admin"]),
    removeShortlist
);
router.get(
    "/shortlist",
    protect,
    checkRoles(["superAdmin", "admin"]),
    getShortlisted
);

module.exports = router;
