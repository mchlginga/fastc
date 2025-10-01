const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        schedule: {
            type: String,
            required: true,
        },
        totalSessions: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
