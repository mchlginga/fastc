const Job = require("../models/job");
const { statusCodes } = require("../utils/constant");

// post job
exports.createJob = async (req, res, next) => {
    const userId = req.user.userId;

    try {
        const job = await Job.create({
            ...req.body,
            postedBy: userId
        })

        res.status(statusCodes.CREATED).json(job);
    } catch (error) {
        next(error);
    }
};

// get list of all jobs
exports.getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().populate("postedBy", "name");
        res.status(statusCodes.OK).json(jobs);
    } catch (error) {
        next(error);
    }
};

// get job by id
exports.getJobById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const job = await Job.findById(id);

        if (!job) {
            res.status(statusCodes.NOT_FOUND).json({ message: "Job not found." });
        }

        res.status(statusCodes.OK).json(job);
    } catch (error) {
        next(error);
    }
};

// update job by id
exports.updateJobById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const updated = await Job.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) {
            res.status(statusCodes.NOT_FOUND).json({ message: "Job not found." });
        }

        res.status(statusCodes.OK).json(updated);
    } catch (error) {
        next(error);
    }
};

// delete job by id
exports.deleteJobById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deleted = await Job.findByIdAndDelete(id);

        if (!deleted) {
            res.status(statusCodes.NOT_FOUND).json({ message: "Job not found." });
        }

        res.status(statusCodes.OK).json({ message: "Job successfully deleted." });
    } catch (error) {
        next(error);
    }
};