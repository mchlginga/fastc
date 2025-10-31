const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const { cloudinary } = require("../config/cloudinary");

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
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete old profile picture from Cloudinary if exists
        if (user.profilePic) {
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = user.profilePic.split("/");
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExtension.split(".")[0];
                const fullPublicId = `fastc/profiles/${publicId}`;

                await cloudinary.uploader.destroy(fullPublicId);
            } catch (deleteError) {
                console.error(
                    "Error deleting old profile picture:",
                    deleteError
                );
                // Continue even if deletion fails
            }
        }

        // Update user profile picture with Cloudinary URL
        user.profilePic = req.file.path; // This is now the Cloudinary URL
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

        // Delete the profile picture from Cloudinary
        try {
            const urlParts = user.profilePic.split("/");
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split(".")[0];
            const fullPublicId = `fastc/profiles/${publicId}`;

            await cloudinary.uploader.destroy(fullPublicId);
        } catch (deleteError) {
            console.error(
                "Error deleting profile picture from Cloudinary:",
                deleteError
            );
            // Continue even if deletion fails
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
