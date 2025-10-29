// models/attendance.js
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
            required: true,
        },
        verifiedAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["verified", "pending", "failed"],
            default: "verified",
        },
        verificationMethod: {
            type: String,
            enum: ["facial_recognition", "manual", "qr_code"],
            required: true,
        },
        imageData: {
            type: String, // Base64 encoded image for facial recognition
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate attendance records
attendanceSchema.index({ user: 1, course: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
