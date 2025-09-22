const User = require("../models/user");
const { statusCodes } = require("../utils/constant");

// create user 
exports.createUser = async (req, res, next) => {
    const { username, firstName, surname, email, password, city, country, role, privacyAgreement } = req.body;

    try {
        if (!privacyAgreement) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "Privacy agreement required." });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "Email already exists." });
        }

        const user = await User.create({
            username,
            firstName,
            surname,
            name: `${firstName} ${surname}`,
            email,
            password,
            city,
            country,
            role: role || "user",
            privacyAgreement
        });

        const publicUser = await User.findById(user._id).select("-password");
        return res.status(statusCodes.CREATED).json({ publicUser });
    } catch (error) {
        next(error);
    }
};

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
    const { username, firstName, surname, city, country, name } = req.body;

    try {
        const updateData = {
            username,
            firstName,
            surname,
            city,
            country,
            name: name || `${firstName || ""} ${surname || ""}`.trim()
        };
        const updated = await User.findByIdAndUpdate(
            id,
            { $set: updateData},
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