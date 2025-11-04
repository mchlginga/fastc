const Skill = require("../models/skill");
const { statusCodes } = require("../utils/constant");

// Get available skills for course assignment
exports.getAvailableSkills = async (req, res, next) => {
    try {
        const skills = await Skill.find({ isActive: true })
            .select("name category description aliases level")
            .sort({ name: 1 });

        res.status(statusCodes.OK).json({
            success: true,
            skills,
        });
    } catch (error) {
        next(error);
    }
};

exports.createSkill = async (req, res, next) => {
    // Skill creation logic
};

exports.updateSkill = async (req, res, next) => {
    // Skill update logic
};
