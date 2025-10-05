const crypto = require("crypto");
const SibApiV3Sdk = require("@sendinblue/client");

const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const generateToken = require("../utils/generateToken");
const config = require("../config/index");

// Initialize Brevo
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    config.brevoApiKey
);

// cookie config
const COOKIE_NAME = "token";
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
};

const setCookieToken = (res, userId, rememberMe) => {
    const token = generateToken(userId);
    res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
    });
};

// Email sending helper using Brevo
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html || `<p>${text}</p>`;
        sendSmtpEmail.sender = { name: "FAST-C", email: config.emailFrom };
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.textContent = text;

        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent successfully:", result);
        return result;
    } catch (error) {
        console.error(
            "Email sending error details:",
            error.response?.body || error.message
        );
        throw new Error("Failed to send email. Please try again later.");
    }
};

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

        await sendEmail({
            to: user.email,
            subject: "FAST-C Password Reset Request",
            text: `You requested a password reset. Click this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Password Reset Request</h2>
                    <p>You requested a password reset for your FAST-C account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
                    <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });

        return res
            .status(statusCodes.OK)
            .json({ message: "Password reset email sent." });
    } catch (error) {
        console.error("Password reset error:", error);
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
            .json({ message: "Password reset successfully." });
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

        await sendEmail({
            to: user.email,
            subject: "FAST-C Email Verification",
            text: `Your FAST-C verification code is: ${verificationCode}\n\nThis code expires in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Email Verification</h2>
                    <p>Welcome to FAST-C! Please verify your email address.</p>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <p style="margin: 0; color: #666; font-size: 14px;">Your verification code is:</p>
                        <h1 style="margin: 10px 0; color: #2563eb; font-size: 36px; letter-spacing: 8px;">${verificationCode}</h1>
                    </div>
                    <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
                </div>
            `,
        });

        return res
            .status(statusCodes.OK)
            .json({ message: "Verification code sent to your email." });
    } catch (error) {
        console.error("Send verification code error:", error);
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
        setCookieToken(res, user.id);
        const publicUser = await User.findById(user._id).select("-password");
        return res.status(statusCodes.OK).json({ publicUser });
    } catch (error) {
        console.error("Verify code error:", error.message);
        next(error);
    }
};

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
