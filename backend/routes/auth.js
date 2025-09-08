const express = require("express");
const router = express.Router();

const { 
    register,
    login,
    getMe,
    logout,
    requestPasswordReset,
    resetPassword
} = require("../controllers/auth");

const { protect } = require("../middlewares/index");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;