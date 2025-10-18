const User = require("../models/user");
const { statusCodes, PATHS } = require("../utils/constant");
const path = require("path");
const fs = require("fs");

exports.uploadProfilePic = async (req, res, next) => {
    try {
        const userId = req.user.id; // From protect middleware
        const file = req.file;

        if (!file) {
            console.error("No file uploaded in request.");
            return res.status(statusCodes.BAD_REQUEST).json({
                message: "No file uploaded.",
            });
        }

        const filePath = path.join(PATHS.profileDir, file.filename);
        console.log(`Saving file to: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            console.error(`File not saved at: ${filePath}`);
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                message: "File save failed.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error(`User not found: ${userId}`);
            return res.status(statusCodes.NOT_FOUND).json({
                message: "User not found.",
            });
        }

        // Update profilePic path
        const profilePicPath = `/uploads/profiles/${file.filename}`;
        user.profilePic = profilePicPath;
        await user.save();

        console.log(
            `Profile picture uploaded for user ${userId}: ${profilePicPath}`
        );

        // Return updated user without password
        const updatedUser = await User.findById(userId).select("-password");
        res.status(statusCodes.OK).json(updatedUser);
    } catch (error) {
        console.error(`Upload profile picture error: ${error.message}`);
        next(error);
    }
};
