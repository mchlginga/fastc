const nodemailer = require("nodemailer");
const crypto = require("crypto");

const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const generateToken = require("../utils/generateToken");
const config = require("../config/index");

// cookie config
const COOKIE_NAME = "token";
const cookieOptions = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "none" : "lax",
    domain: config.env === "production" ? ".render.com" : undefined,
};

const setCookieToken = (res, userId, rememberMe) => {
    const token = generateToken(userId);
    res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
    });
};

// nodemailer transporter
const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

exports.register = async (req, res, next) => {
    const { firstName, surname, email, password, role, privacyAgreement } =
        req.body;

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
                .json({ message: "Email already exist." });
        }

        const user = await User.create({
            firstName,
            surname,
            name: `${firstName} ${surname}`,
            email,
            password,
            role: role || "user",
            privacyAgreement,
        });

        setCookieToken(res, user.id);

        const publicUser = await User.findById(user._id).select("-password");

        return res.status(statusCodes.CREATED).json({ publicUser });
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
        setCookieToken(res, user.id, rememberMe);
        const publicUser = await User.findById(user._id).select("-password");
        return res.status(statusCodes.OK).json({ publicUser });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

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

exports.requestPasswordReset = async (req, res, next) => {
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

        const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;
        const message = `You requested a password reset. Click this link to reset your password: ${resetUrl}`;

        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset Request",
            text: message,
        });

        return res
            .status(statusCodes.OK)
            .json({ message: "Password reset email sent." });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Invalid or expired token." });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res
            .status(statusCodes.OK)
            .json({ message: "Password reset succesfully." });
    } catch (error) {
        next(error);
    }
};

exports.sendVerificationCode = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }
        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
        await user.save();
        const message = `Your FAST-C verification code is: ${verificationCode}. It expires in 10 minutes.`;
        await transporter.sendMail({
            to: user.email,
            subject: "FAST-C Email Verification",
            text: message,
        });
        return res
            .status(statusCodes.OK)
            .json({ message: "Verification code sent to your email." });
    } catch (error) {
        console.error("Send verification code error:", error.message);
        next(error);
    }
};

exports.verifyCode = async (req, res, next) => {
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
        setCookieToken(res, user.id); // Ensure token is set
        const publicUser = await User.findById(user._id).select("-password");
        return res.status(statusCodes.OK).json({ publicUser });
    } catch (error) {
        console.error("Verify code error:", error.message);
        next(error);
    }
};

// Check username uniqueness
exports.checkUsername = async (req, res, next) => {
    const { username } = req.body;
    try {
        if (!username) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Username is required." });
        }
        const existing = await User.findOne({ username });
        return res.status(statusCodes.OK).json({ available: !existing });
    } catch (error) {
        next(error);
    }
};
