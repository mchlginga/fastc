const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const generateCert = require("../utils/generateCert");

exports.generateCert = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(statusCodes.NOT_FOUND).json({ message: "User not found."});
        }

        const pdf = await generateCert({
            name: user.name,
            date: new Date().toLocaleDateString()
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