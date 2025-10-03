const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course.lessons",
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
