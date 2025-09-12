const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const generateCert = require("../utils/generateCert");

exports.generateCert = async (req, res, next) => {
    const userId = req.user.id;
    const { certificateName } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "User not found." });
        }

        const pdf = await generateCert({
            name: user.name,
            certificateName: certificateName || "Course Completion",
            date: new Date().toLocaleDateString()
        });

        if(certificateName) {
            user.certificates.push({
                name: certificateName,
                issuedAt: new Date()
            });

            await user.save();
        }

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `filename=${user.name}-${certificateName || "certificate.pdf"}`
        });

        res.send(pdf);

    } catch (error) {
        next(error);
    }
};