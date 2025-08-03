const { statusCodes } = require("../utils/constant");
const User = require("../models/user");

exports.uploadProfilePic = async (req, res, next) => {
    const userId = req.user.id;

    try {
        if (!req.file) {
            res.status(statusCodes.NOT_FOUND).json({ message: "No file uploaded." });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { profilePic: req.file.filename },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(statusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
};