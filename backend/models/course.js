const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        duration: {
            type: String,
            trim: true,
        },
        endDate: {
            type: Date,
            default: null, // Null means course is always active
        },
        lessons: [
            {
                title: { type: String, trim: true },
                duration: { type: String, trim: true },
                order: { type: Number },
                content: { type: String, trim: true }, // For future video/text
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
