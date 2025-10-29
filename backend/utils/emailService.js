const SibApiV3Sdk = require("@sendinblue/client");
const config = require("../config/index");
const { statusCodes } = require("./constant");

// brevo config (email sender)
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    config.brevoApiKey
);

// brevo email sending helper
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
        throw new Error("Send Email failed");
    }
};

exports.sendVerificationEmail = async (email, verificationCode) => {
    try {
        return await sendEmail({
            to: email,
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
    } catch (error) {
        throw new Error("Failed to send email.", error.stack);
    }
};

exports.sendRequestResetPassword = async (email, resetUrl) => {
    try {
        return await sendEmail({
            to: email,
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
    } catch (error) {
        throw new Error("Failed to request password.", error.stack);
    }
};
