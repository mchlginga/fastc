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
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course.lessons",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Completion = mongoose.model("Completion", completionSchema);
module.exports = Completion;
