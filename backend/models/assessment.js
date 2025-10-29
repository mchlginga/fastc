const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
    {
        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
        },
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        score: {
            type: Number,
            min: 0,
            max: 100,
        },
        passed: {
            type: Boolean,
        },
        takenAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;
