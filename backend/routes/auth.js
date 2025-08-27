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
router.get("/me", protect, getMe);
router.post("/logout", logout);

module.exports = router;