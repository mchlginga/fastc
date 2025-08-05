const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    skillsRequired: {
        type: [String]
    },

    certsRequired: {
        type: [String]
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: "Job"
    }
}, {
    timestamps: true
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;