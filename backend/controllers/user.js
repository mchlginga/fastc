const User = require("../models/user");
const { statusCodes } = require("../utils/constant");

// get all users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: "user" }).select("-password");

        res.status(statusCodes.OK).json(users);

    } catch (error) {
        next(error);
    }
};

// get user by id
exports.getUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id, role: "user" });

        if (!user) {
            res.status(statusCodes.NOT_FOUND).json({ message: "User not found." });
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
        const updated = await User.findOneAndUpdate(
            { _id: id, role: "user" },
            updateData,
            { new: true, runValidators: true,}
        ).select("-password");

        if (!updated) {
            res.status(statusCodes.NOT_FOUND).json({ message: "User not found." });
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
        const deleted = await User.findOneAndDelete({ _id: id, role: "user" });

        if (!deleted) {
            res.status(statusCodes.NOT_FOUND).json({ message: "User not found."});
        }

        res.status(statusCodes.OK).json({ message: "User deleted successfully."});
    } catch (error) {
        next(error);
    }
};