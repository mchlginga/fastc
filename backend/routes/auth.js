const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/index");
const {
    register,
    login,
    verifyEmail,
    resendVerificationCode,
    requestResetPassword,
    resetPassword,
    getMe,
    logout,
    // logout,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/send-verification-code", resendVerificationCode);
router.post("/request-reset-password", requestResetPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.post("/logout", logout);

module.exports = router;
