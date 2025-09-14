const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String
    },

    duration: {
        type: String
    }
}, {
    timestamps: true
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;