const mongoose = require("mongoose");

const shortlistSchema = new mongoose.Schema(
    {
        shortlister: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        trainee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

shortlistSchema.index({ shortlister: 1, trainee: 1 }, { unique: true });

const Shortlist = mongoose.model("Shortlist", shortlistSchema);
module.exports = Shortlist;
