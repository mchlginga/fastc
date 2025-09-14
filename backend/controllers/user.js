const User = require("../models/user");
const { statusCodes } = require("../utils/constant");

// get logged-in user's profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "User not found." });
        }

        res.status(statusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
};

// get all users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        res.status(statusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
};

// get user by id
exports.getUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "User not found." });
        }

        res.status(statusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
};

// update user by id
exports.updateUserById = async (req, res, next) => {
    const { id } = req.params;
    const { email, password, role, ...updateData } = req.body;

    try {
        const updated = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true,}
        ).select("-password");
        if (!updated) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "User not found." });
        }

        res.status(statusCodes.OK).json(updated);
    } catch (error) {
        next(error);
    }
};

// delete user by id
exports.deleteUserById = async (req, res, next) => {
    const { id } = req.params;

    try {   
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "User not found."});
        }

        res.status(statusCodes.OK).json({ message: "User deleted successfully."});
    } catch (error) {
        next(error);
    }
};