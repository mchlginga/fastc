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
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 1000
};

const setCookieToken = (res, userId) => {
    const token = generateToken(userId);
    res.cookie(COOKIE_NAME, token, cookieOptions);
};

// nodemailer transporter
const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});

exports.register = async (req, res, next) => {
    const {
        username,
        firstName,
        surname,
        email,
        password,
        city,
        country,
        privacyAgreement
    } = req.body;

    try {
        const existing = await User.findOne({ email });
        
        if (existing) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "Email already exist." });
        }

        const user = await User.create({
            username,
            firstName,
            surname,
            email,
            password,
            city,
            country,
            privacyAgreement
        });

        setCookieToken(res, user.id);

        const publicUser = await User.findById(user._id).select("-password");

        return res.status(statusCodes.CREATED).json({ publicUser });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.matchPassword(password))) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: "Invalid Email or Password"} );
        }

        setCookieToken(res, user.id);

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
            return res.status(statusCodes.NOT_FOUND).json({ message: "User not found." })    ;
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
            maxAge: 0
        });

        return res.status(statusCodes.OK).json({ message: "Logged out successfully"});
    } catch (error) {
        next(error);
    }
};

exports.requestPasswordReset = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "User not found." });
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
            text: message
        });

        return res.status(statusCodes.OK).json({ message: "Password reset email sent." });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "Invalid or expired token." });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(statusCodes.OK).json({ message: "Password rerset succesfully." });
    } catch (error) {
        next(error);
    }
};