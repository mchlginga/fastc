const crypto = require("crypto");
const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const generateToken = require("../utils/generateToken");
const config = require("../config/index");
const {
    sendVerificationEmail,
    sendRequestResetPassword,
} = require("../utils/emailService");

// cookie config
const COOKIE_NAME = "token";
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
};
const setCookieToken = (res, token, rememberMe) => {
    res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
    });
};

exports.register = async (req, res, next) => {
    const {
        firstName,
        surname,
        email,
        password,
        companyName,
        privacyAgreement,
        role,
    } = req.body;

    try {
        if (!privacyAgreement) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Privacy agreement required." });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Email already exists." });
        }
        // generate verification code
        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const userData = {
            email,
            password,
            privacyAgreement,
            role: role || "user",
            verificationCode,
            verificationCodeExpires: Date.now() + 10 * 60 * 1000,
        };
        if (role === "company") {
            userData.companyName = companyName;
        } else {
            userData.firstName = firstName;
            userData.surname = surname;
        }

        const user = await User.create(userData);
        // send email verification code
        await sendVerificationEmail(user.email, verificationCode);
        const publicUser = await User.findById(user._id).select("-password");
        res.status(statusCodes.CREATED).json({ publicUser });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password, rememberMe } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            return res
                .status(statusCodes.UNAUTHORIZED)
                .json({ message: "Invalid Email or Password" });
        }
        if (!user.isEmailVerified) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Please verify your email first." });
        }

        const token = generateToken(user._id);
        setCookieToken(res, token, rememberMe);
        const publicUser = await User.findById(user._id).select("-password");
        return res.status(statusCodes.OK).json({ token, user: publicUser });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Invalid or expired verification code." });
        }
        user.isEmailVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Generate and set token
        const token = generateToken(user._id);
        setCookieToken(res, token, false); // Set cookie

        const publicUser = await User.findById(user._id).select("-password");
        return res.status(statusCodes.OK).json({
            publicUser,
            token,
        });
    } catch (error) {
        next(error);
    }
};

exports.resendVerificationCode = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found" });
        }
        if (user.isEmailVerified) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Email already verified." });
        }
        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendVerificationEmail(user.email, verificationCode);
        res.status(statusCodes.OK).json({
            code: verificationCode,
            message: "Verification code resent",
        });
    } catch (error) {
        next(error);
    }
};

exports.requestResetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `${config.frontendUrl}/forgot-password/${resetToken}`;
        await sendRequestResetPassword(user.email, resetUrl);

        res.status(statusCodes.OK).json({
            token: resetToken,
            message: "Password reset email sent.",
        });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    const { newPassword, token } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordToken = undefined;
        await user.save();

        res.status(statusCodes.OK).json({
            message: "Password reset successfully.",
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    const { id } = req.user;
    try {
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }
        return res.status(statusCodes.OK).json({ user });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res, next) => {
    try {
        res.clearCookie(COOKIE_NAME, {
            ...cookieOptions,
            maxAge: 0,
        });

        return res
            .status(statusCodes.OK)
            .json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};
