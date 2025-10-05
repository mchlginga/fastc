const Course = require("../models/course");
const Completion = require("../models/completion");
const { statusCodes } = require("../utils/constant");

exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.status(statusCodes.OK).json(courses);
    } catch (error) {
        next(error);
    }
};

exports.getCourseById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Course not found",
            });
        }
        res.status(statusCodes.OK).json(course);
    } catch (error) {
        next(error);
    }
};

exports.getActiveCourses = async (req, res, next) => {
    try {
        const now = new Date();
        const courses = await Course.find({
            $or: [{ endDate: { $gt: now } }, { endDate: null }],
        }).lean();
        const activeCourses = await Promise.all(
            courses.map(async (course) => {
                const enrollees = await Completion.countDocuments({
                    course: course._id,
                    status: "approved",
                });
                return {
                    _id: course._id.toString(),
                    title: course.title,
                    desc: course.duration
                        ? `${course.duration} • ${enrollees} enrollees`
                        : `${enrollees} enrollees`,
                };
            })
        );
        res.status(statusCodes.OK).json(activeCourses);
    } catch (error) {
        next(error);
    }
};

exports.getActiveCoursesCount = async (req, res, next) => {
    try {
        const now = new Date();
        const count = await Course.countDocuments({
            $or: [{ endDate: { $gt: now } }, { endDate: null }],
        });
        res.status(statusCodes.OK).json({ count });
    } catch (error) {
        next(error);
    }
};
