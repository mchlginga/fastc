const Completion = require("../models/completion");
const { statusCodes } = require("../utils/constant");

exports.getCompletions = async (req, res, next) => {
  const { user } = req.query;

  try {
    const query = req.user.role === "admin" || req.user.role === "company" ? {} : { user };
    const completions = await Completion.find(query).populate("user course");
    res.status(statusCodes.OK).json(completions);
  } catch (error) {
    next(error);
  }
};

exports.createCompletions = async (req, res, next) => {
  const { user, course } = req.body;

  try {
    const completion = await Completion.create({ user, course });
    const populatedCompletion = await Completion.findById(completion._id).populate("user course");
    res.status(statusCodes.CREATED).json(populatedCompletion);
  } catch (error) {
    next(error);
  }
};