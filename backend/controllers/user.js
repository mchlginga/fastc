const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const { certificateToSkillMap } = require("./certificate");

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

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(statusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
};

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
        position,
        industryType,
        profileStatus,
        representative,
    } = req.body;

    const files = req.files || [];
    let educationFilesIndex = 0;
    let certificateFilesIndex = 0;
    let idProofFile = null;
    let businessPermitFile = null;
    let representativeIdProofFile = null;

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

        if (user.role === "company") {
            if (files.length > educationFilesIndex + certificateFilesIndex) {
                businessPermitFile = `/uploads/profiles/${
                    files[educationFilesIndex + certificateFilesIndex]?.filename
                }`;
            }
            if (
                files.length >
                educationFilesIndex + certificateFilesIndex + 1
            ) {
                representativeIdProofFile = `/uploads/profiles/${
                    files[educationFilesIndex + certificateFilesIndex + 1]
                        ?.filename
                }`;
            }
        }

        const updateData = {
            username,
            firstName,
            surname,
            name:
                user.role === "company"
                    ? user.companyName
                    : `${firstName || user.firstName} ${
                          surname || user.surname
                      }`.trim(),
            birthdate,
            gender,
            contactNumber,
            address,
            education: parsedEducation,
            certificates: parsedCertificates,
            position,
            idProof: idProofFile || user.idProof,
            industryType,
            businessPermit: businessPermitFile || user.businessPermit,
            representative: representative
                ? typeof representative === "string"
                    ? JSON.parse(representative)
                    : representative
                : user.representative,
        };

        if (representative && representativeIdProofFile) {
            updateData.representative = {
                ...updateData.representative,
                idProof: representativeIdProofFile,
            };
        }

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

exports.getOnlineUsers = async (req, res, next) => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const users = await User.find({
            lastActive: { $gte: fiveMinutesAgo },
            role: "user",
        }).select("name email lastActive");
        res.status(statusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
};

exports.updateLastActive = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }
        user.lastActive = new Date();
        await user.save();
        res.status(statusCodes.OK).json({ message: "Last active updated." });
    } catch (error) {
        next(error);
    }
};

exports.updateCertificate = async (req, res, next) => {
    const { userId, certIndex } = req.params;
    const { name, issuer, date, expiration } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        // Index safety
        if (!user.certificates || certIndex >= user.certificates.length) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Certificate index out of bounds." });
        }

        // Update fields (only the ones sent)
        const cert = user.certificates[certIndex];
        if (name !== undefined) cert.name = name;
        if (issuer !== undefined) cert.issuer = issuer;
        if (date !== undefined) cert.date = new Date(date);
        if (expiration !== undefined) cert.expiration = new Date(expiration);

        await user.save();

        const updated = await User.findById(userId).select("-password");
        res.status(statusCodes.OK).json(updated);
    } catch (error) {
        next(error);
    }
};

// update certificate
exports.updateCertificate = async (req, res, next) => {
    const { userId, certIndex } = req.params;
    const { name, issuer, date, expiration } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        const certIndexNum = parseInt(certIndex);
        if (
            isNaN(certIndexNum) ||
            certIndexNum < 0 ||
            certIndexNum >= user.certificates.length
        ) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Invalid certificate index." });
        }

        // Get current cert to preserve proof and other fields
        const currentCert = user.certificates[certIndexNum];

        // Update only provided fields, preserve proof
        user.certificates[certIndexNum] = {
            ...currentCert, // Preserve everything including proof
            name: name ?? currentCert.name,
            issuer: issuer ?? currentCert.issuer,
            date: date ? new Date(date) : currentCert.date,
            expiration: expiration
                ? new Date(expiration)
                : currentCert.expiration,
        };

        await user.save();
        const updatedUser = await User.findById(userId).select("-password");
        res.status(statusCodes.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// add skill from cert
exports.addSkillFromCertificate = async (req, res, next) => {
    const { userId, certIndex } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        if (certIndex < 0 || certIndex >= user.certificates.length) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Invalid certificate index." });
        }

        const certName = user.certificates[certIndex].name;
        const skill = certificateToSkillMap[certName] || certName; // Map or fallback

        // Add skill if not already present
        if (!user.skills.includes(skill)) {
            user.skills.push(skill);
            await user.save();
        }

        const updatedUser = await User.findById(userId).select("-password");
        res.status(statusCodes.OK).json({
            message: `Skill "${skill}" added.`,
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
