const User = require("../models/user");
const { statusCodes } = require("../utils/constant");

// Helper function to process education/certificate data with file attachments
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
            // Keep existing proofs if not marked for removal
            if (item.proof === "existing" && item.existingProof) {
                return { ...item, proof: item.existingProof };
            }

            // Attach new files
            if (item.proof === "new" && files[startIndex + used]) {
                const proofPath = `/uploads/profiles/${
                    files[startIndex + used].filename
                }`;
                used++;
                return { ...item, proof: proofPath };
            }

            // Remove proof if marked for removal
            if (item.proof === "remove") {
                const { proof, ...itemWithoutProof } = item;
                return itemWithoutProof;
            }

            return item;
        });
        return { parsed, used };
    } catch {
        throw new Error("Invalid JSON format.");
    }
};

// 🆕 Update Education
exports.updateEducation = async (req, res, next) => {
    const { education } = req.body;
    const files = req.files || [];

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found.",
            });
        }

        // Process education with file attachments
        const educationResult = parseAndAttachProofs(education, files, 0);

        // Build update data
        const updateData = {};
        if (educationResult.parsed !== null) {
            updateData.education = educationResult.parsed;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        res.status(statusCodes.OK).json({
            success: true,
            message: "Education updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

// 🆕 Update Certificates
exports.updateCertificates = async (req, res, next) => {
    const { certificates } = req.body;
    const files = req.files || [];

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found.",
            });
        }

        // Process certificates with file attachments
        const certificateResult = parseAndAttachProofs(certificates, files, 0);

        // Build update data
        const updateData = {};
        if (certificateResult.parsed !== null) {
            updateData.certificates = certificateResult.parsed;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        res.status(statusCodes.OK).json({
            success: true,
            message: "Certificates updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
