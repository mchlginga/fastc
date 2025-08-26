const express = require("express");
const router = express.Router();

const { 
    register,
    login,
    getMe,
    logout
} = require("../controllers/auth");

const { protect } = require("../middlewares/index");

router.post("/register", register);
router.post("/login", login);
router.get("/me",)
router.post("/logout", protect, logout);

module.exports = router;