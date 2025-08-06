const { findMatchingUserForJob } = require("../services/match");
const { statusCodes } = require("../utils/constant");

exports.getUserMatchtoJob = async (req, res, next) => {
    const { id } = req.params;
    
    try {
        const matches = await findMatchingUserForJob(id);

        res.status(statusCodes.OK).json(matches);
    } catch (error) {
        next(error);
    }
};