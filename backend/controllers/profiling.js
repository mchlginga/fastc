const User = require("../models/user");
const { statusCodes } = require("../utils/constant");

const parseAndAttachProofs = (data, files, startIndex = 0) => {
    if (!data) return { parsed: null, used: 0 };

    try {
        const arr = typeof data === "string" ? JSON.parse(data) : data;

        // If empty array provided, treat as "clear all"
        if (Array.isArray(arr) && arr.length === 0) {
            return { parsed: [], used: 0 };
        }

        let used = 0;
        const parsed = arr.map((item) => {
            if (item.proof === "new" && files[startIndex + used]) {
                const proofPath = `/uploads/profiles/${
                    files[startIndex + used].filename
                }`;
                used++;
                return { ...item, proof: proofPath };
            }
            return item;
        });
        return { parsed, used };
    } catch {
        throw new Error("Invalid JSON format.");
    }
};

const parseRepresentative = (representative) => {
    if (!representative) return null;

    try {
        return typeof representative === "string"
            ? JSON.parse(representative)
            : representative;
    } catch {
        throw new Error("Invalid representative format.");
    }
};

exports.updateProfile = async (req, res, next) => {
    const {
        birthdate,
        gender,
        contactNumber,
        address,
        education,
        certificates,
        representative,
    } = req.body;

    const files = req.files || [];

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "User not found.",
            });
        }

        // Process education and certificates with file attachments
        const educationResult = parseAndAttachProofs(education, files, 0);
        const certificateResult = parseAndAttachProofs(
            certificates,
            files,
            educationResult.used
        );

        // Parse representative
        const parsedRepresentative = parseRepresentative(representative);

        // Handle business permit for companies
        let businessPermitFile = null;
        if (user.role === "company") {
            const totalUsed = educationResult.used + certificateResult.used;
            if (files[totalUsed]) {
                businessPermitFile = `/uploads/profiles/${files[totalUsed].filename}`;
            }
        }

        // Build update data - only update provided fields
        const updateData = {};

        // Basic profile fields
        if (birthdate !== undefined) updateData.birthdate = birthdate;
        if (gender !== undefined) updateData.gender = gender;
        if (contactNumber !== undefined)
            updateData.contactNumber = contactNumber;
        if (address !== undefined) updateData.address = address;

        // Array fields - only update if provided (null means not provided)
        if (educationResult.parsed !== null)
            updateData.education = educationResult.parsed;
        if (certificateResult.parsed !== null)
            updateData.certificates = certificateResult.parsed;
        if (parsedRepresentative !== null)
            updateData.representative = parsedRepresentative;

        // File uploads
        if (businessPermitFile) updateData.businessPermit = businessPermitFile;

        // ONLY set to pending for NEW users (first-time profile setup)
        // Existing users can update their profiles without going back to pending
        if (user.profileStatus === "pending") {
            // New user completing profile for first time - stays pending for admin approval
            updateData.profileStatus = "pending";
        }
        // Approved/rejected users keep their current status

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        res.status(statusCodes.OK).json(updated);
    } catch (error) {
        next(error);
    }
};
