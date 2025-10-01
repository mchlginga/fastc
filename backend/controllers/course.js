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
