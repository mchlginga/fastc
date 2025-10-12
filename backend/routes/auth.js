const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/index");
const {
    register,
    login,
    getMe,
    logout,
    requestPasswordReset,
    resetPassword,
    sendVerificationCode,
    verifyCode,
    checkUsername,
    updateProfile, // Added this
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/send-verification-code", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/check-username", checkUsername);
router.put("/profile", protect, updateProfile); // Added this route

module.exports = router;
