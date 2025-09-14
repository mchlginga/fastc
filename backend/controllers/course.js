
const Course = require("../models/course");
const { statusCodes } = require("../utils/constant");

exports.createCourse = async (req, res, next) => {
    const { name, description, duration } = req.body;

    try {
        const course = await Course.create({
            name,
            description,
            duration
        });

        return res.status(statusCodes.CREATED).json(course);
    } catch (error) {
        next(error);
    }
};

exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.find();
        
        return res.status(statusCodes.OK).json(course);
    } catch (error) {
        next(error);
    }
};