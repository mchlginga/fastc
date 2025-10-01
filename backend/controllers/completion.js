const Completion = require("../models/completion");
const User = require("../models/user");
const { statusCodes } = require("../utils/constant");

exports.getCompletions = async (req, res, next) => {
    const { user } = req.query;

    try {
        if (!user && req.user.role !== "admin" && req.user.role !== "company") {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "User ID required." });
        }

        const query =
            req.user.role === "admin" || req.user.role === "company"
                ? {}
                : { user: user || req.user.id };
        if (user) {
            const userExists = await User.findById(user);
            if (!userExists) {
                return res
                    .status(statusCodes.NOT_FOUND)
                    .json({ message: "User not found." });
            }
        }

        const completions = await Completion.find(query)
            .populate({
                path: "user",
                select: "name email",
            })
            .populate({
                path: "course",
                select: "title",
            });

        res.status(statusCodes.OK).json({ courses: completions });
    } catch (error) {
        next(error);
    }
};

exports.createCompletions = async (req, res, next) => {
    const { user, course, title, schedule, totalSessions } = req.body;

    try {
        if (!user || !course || !title || !schedule || !totalSessions) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({
                    message:
                        "Missing required fields: user, course, title, schedule, totalSessions.",
                });
        }

        const userExists = await User.findById(user);
        if (!userExists) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        // Replace with actual Course model check later
        const courseExists = true; // Mock check, replace with Course.findById(course)
        if (!courseExists) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "Course not found." });
        }

        const existingCompletion = await Completion.findOne({ user, course });
        if (existingCompletion) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "User already enrolled in this course." });
        }

        const completion = await Completion.create({
            user,
            course,
            title,
            schedule,
            totalSessions,
            progress: 0,
            sessionsCompleted: 0,
            absences: 0,
        });

        const populatedCompletion = await Completion.findById(completion._id)
            .populate("user", "name email")
            .populate("course", "title");

        res.status(statusCodes.CREATED).json(populatedCompletion);
    } catch (error) {
        next(error);
    }
};
