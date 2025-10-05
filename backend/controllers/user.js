const User = require("../models/user");
const { statusCodes } = require("../utils/constant");

// Create user
exports.createUser = async (req, res, next) => {
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
                .json({ message: "Email already exists." });
        }

        const user = await User.create({
            firstName,
            surname,
            name: `${firstName} ${surname}`.trim(),
            email,
            password,
            role: role || "user",
            privacyAgreement,
        });

        const publicUser = await User.findById(user._id).select("-password");
        return res.status(statusCodes.CREATED).json({ publicUser });
    } catch (error) {
        next(error);
    }
};

// Get logged-in user's profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        res.status(statusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
};

// Get all users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(statusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
};

// Get user by id
exports.getUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        res.status(statusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
};

// Update user by id
exports.updateUserById = async (req, res, next) => {
    const { id } = req.params;
    const { username, firstName, surname } = req.body;

    try {
        const updateData = {
            username,
            firstName,
            surname,
            name: `${firstName || ""} ${surname || ""}`.trim(),
        };
        const updated = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");
        if (!updated) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        res.status(statusCodes.OK).json(updated);
    } catch (error) {
        next(error);
    }
};

// Delete user by id
exports.deleteUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        res.status(statusCodes.OK).json({
            message: "User deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

// Update logged-in user's profile
exports.updateProfile = async (req, res, next) => {
    const {
        username,
        firstName,
        surname,
        birthdate,
        gender,
        contactNumber,
        address,
        education,
        certificates,
        profileStatus,
    } = req.body;

    const files = req.files || [];
    let educationFilesIndex = 0;
    let certificateFilesIndex = 0;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        if (username && username !== user.username) {
            const existing = await User.findOne({ username });
            if (existing) {
                return res
                    .status(statusCodes.BAD_REQUEST)
                    .json({ message: "Username is already taken." });
            }
        }

        let parsedEducation = user.education || [];
        if (education) {
            try {
                parsedEducation =
                    typeof education === "string"
                        ? JSON.parse(education)
                        : education;
                parsedEducation = parsedEducation.map((edu) => {
                    if (
                        edu.proof === "new" &&
                        educationFilesIndex < files.length
                    ) {
                        return {
                            ...edu,
                            proof: `/uploads/profiles/${
                                files[educationFilesIndex++].filename
                            }`,
                        };
                    }
                    return edu;
                });
            } catch (error) {
                return res
                    .status(statusCodes.BAD_REQUEST)
                    .json({ message: "Invalid education format." });
            }
        }

        let parsedCertificates = user.certificates || [];
        if (certificates) {
            try {
                parsedCertificates =
                    typeof certificates === "string"
                        ? JSON.parse(certificates)
                        : certificates;
                parsedCertificates = parsedCertificates.map((cert) => {
                    if (
                        cert.proof === "new" &&
                        certificateFilesIndex < files.length
                    ) {
                        return {
                            ...cert,
                            proof: `/uploads/profiles/${
                                files[certificateFilesIndex++].filename
                            }`,
                        };
                    }
                    return cert;
                });
            } catch (error) {
                return res
                    .status(statusCodes.BAD_REQUEST)
                    .json({ message: "Invalid certificates format." });
            }
        }

        const updateData = {
            username,
            firstName,
            surname,
            name: `${firstName || user.firstName} ${
                surname || user.surname
            }`.trim(),
            birthdate,
            gender,
            contactNumber,
            address,
            education: parsedEducation,
            certificates: parsedCertificates,
        };

        if (profileStatus !== undefined) {
            updateData.profileStatus = profileStatus;
        }

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(statusCodes.OK).json(updated);
    } catch (error) {
        next(error);
    }
};

// Admin review profile
exports.reviewProfile = async (req, res, next) => {
    const { id } = req.params;
    const { profileStatus } = req.body;

    try {
        if (!["approved", "rejected"].includes(profileStatus)) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Invalid profile status." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        user.profileStatus = profileStatus;
        await user.save();

        const updated = await User.findById(id).select("-password");
        res.status(statusCodes.OK).json(updated);
    } catch (error) {
        next(error);
    }
};

// Get pending profiles
exports.getPendingProfiles = async (req, res, next) => {
    try {
        const users = await User.find({ profileStatus: "pending" }).select(
            "-password"
        );
        res.status(statusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
};
