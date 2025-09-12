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

        // certificate exists in user's certificates?
        const certificate = user.certificates.find(cert => cert.name === certificateName);
        if (!certificate) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "Certificate not found." });
        }

        const pdf = await generateCert({
            name: user.name,
            certificateName,
            date: certificate.issuedAt ? new Date(certificate.issuedAt).
            toLocaleDateString() : new Date().toLocaleDateString()
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `filename=${user.name}-certificate.pdf`
        });

        res.send(pdf);

    } catch (error) {
        next(error);
    }
};