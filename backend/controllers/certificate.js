const User = require("../models/user");
const Completion = require("../models/completion");
const { statusCodes } = require("../utils/constant");
const generateCert = require("../utils/generateCert");

exports.generateCert = async (req, res, next) => {
    const userId = req.user.id;
    const { courseId } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "User not found." });
        }

        const completion = await Completion.findOne({ 
            user: userId,
            course: courseId
        }).populate("course");
        if (!completion) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "Course completion not found."});
        }

        const pdf = await generateCert({
            name: user.name,
            certificateName: completion.course.name,
            date: completion.completedAt.toLocaleDateString()
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `filename=${user.name}-${completion.course.name}.pdf`
        });

        res.send(pdf);

    } catch (error) {
        next(error);
    }
};