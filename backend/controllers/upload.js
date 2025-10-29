const User = require("../models/user");
const { statusCodes, PATHS } = require("../utils/constant");
const path = require("path");
const fs = require("fs");

// Upload profile picture
exports.uploadProfilePic = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            // Delete the uploaded file if user not found
            fs.unlinkSync(req.file.path);
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete old profile picture if exists
        if (user.profilePic) {
            const oldFilePath = path.join(
                PATHS.profileDir,
                path.basename(user.profilePic)
            );
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // Update user profile picture
        user.profilePic = `/uploads/profiles/${req.file.filename}`;
        await user.save();

        const updatedUser = await User.findById(req.user.id).select(
            "-password"
        );

        res.status(statusCodes.OK).json({
            success: true,
            message: "Profile picture uploaded successfully",
            user: updatedUser,
        });
    } catch (error) {
        // Delete the uploaded file if error occurs
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
};

exports.removeProfilePic = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if user has a profile picture to remove
        if (!user.profilePic) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "No profile picture to remove",
            });
        }

        // Delete the profile picture file from server
        const profilePicPath = path.join(
            PATHS.profileDir,
            path.basename(user.profilePic)
        );

        if (fs.existsSync(profilePicPath)) {
            fs.unlinkSync(profilePicPath);
        }

        // Remove profile picture reference from user
        user.profilePic = "";
        await user.save();

        const updatedUser = await User.findById(req.user.id).select(
            "-password"
        );

        res.status(statusCodes.OK).json({
            success: true,
            message: "Profile picture removed successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Remove profile picture error:", error);
        next(error);
    }
};
