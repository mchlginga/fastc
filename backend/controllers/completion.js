const Completion = require("../models/completion");
const { statusCodes } = require("../utils/constant");

exports.getCompletions = async (req, res, next) => {
    const { user } = req.query;

    try {
        const completions = await Completion.find({ user }).populate("course");
        res.status(statusCodes.OK).json(completions);
    } catch (error) {
        next(error);
    }
};

exports.createCompletions = async (req, res, next) => {
    const { user, course } = req.body;

    try {
        const completion = await Completion.create({ user, course });
        res.status(statusCodes.CREATED).json(completion);
    } catch (error) {
        next(error);
    }
};