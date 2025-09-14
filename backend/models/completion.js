const mongoose = require("mongoose");

const completionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId, ref: "Course",
        required: true
    },

    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Completion = mongoose.model("Completion", completionSchema);
module.exports = Completion;