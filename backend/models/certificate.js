const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
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
            trim: true,
        },
        completionDate: {
            type: Date,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        certificateUrl: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "expired"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;
