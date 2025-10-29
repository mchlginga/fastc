const User = require("../models/user");
const Enrollment = require("../models/enrollment");
const { statusCodes } = require("../utils/constant");

// Get user profile
exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Update user profile - NO MORE PENDING RESETS!
exports.updateUserProfile = async (req, res, next) => {
    try {
        const {
            firstName,
            surname,
            contactNumber,
            address,
            birthdate,
            gender,
            availability,
            skills,
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        // Update fields - no status changes at all!
        if (firstName !== undefined) user.firstName = firstName;
        if (surname !== undefined) user.surname = surname;
        if (contactNumber !== undefined) user.contactNumber = contactNumber;
        if (address !== undefined) user.address = address;
        if (birthdate !== undefined) user.birthdate = birthdate;
        if (gender !== undefined) user.gender = gender;
        if (availability !== undefined) user.availability = availability;
        if (skills !== undefined) user.skills = skills;

        // NO profile status changes - users can update their basic info freely
        await user.save();

        const updatedUser = await User.findById(req.user.id).select(
            "-password"
        );

        res.status(statusCodes.OK).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "New password must be at least 6 characters long",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await user.matchPassword(
            currentPassword
        );
        if (!isCurrentPasswordValid) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(statusCodes.OK).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        next(error);
    }
};
