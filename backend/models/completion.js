const mongoose = require("mongoose");

const completionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        schedule: {
            type: String,
            required: true,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        sessionsCompleted: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalSessions: {
            type: Number,
            required: true,
            min: 1,
        },
        absences: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Completion = mongoose.model("Completion", completionSchema);
module.exports = Completion;
