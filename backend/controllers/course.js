const Course = require("../models/course");
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
