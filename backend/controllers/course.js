const Course = require("../models/course");
const Enrollment = require("../models/enrollment");
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

        // Get courses that are active AND (have no end date OR end date is in future)
        const courses = await Course.find({
            isActive: true,
            $or: [{ endDate: { $gt: now } }, { endDate: null }],
        }).lean();

        const activeCourses = await Promise.all(
            courses.map(async (course) => {
                const enrollees = await Enrollment.countDocuments({
                    course: course._id,
                    status: { $in: ["active", "completed"] },
                });

                return {
                    _id: course._id.toString(),
                    title: course.title,
                    desc: course.duration
                        ? `${course.duration} • ${enrollees} enrollees`
                        : `${enrollees} enrollees`,
                    // Enrollment deadline info
                    enrollmentDeadline: course.endDate
                        ? `Enroll until ${new Date(
                              course.endDate
                          ).toLocaleDateString()}`
                        : "Open enrollment",
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
