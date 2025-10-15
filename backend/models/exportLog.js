const mongoose = require("mongoose");

// Track every time admin or company exports CSV
const exportLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["superAdmin", "admin", "company"],
            required: true,
        },
        exportType: {
            type: String,
            enum: ["trainees", "courses", "certificates", "job-matching"],
            required: true,
        },
        recordsCount: {
            type: Number,
            default: 0,
        },
        filters: {
            skills: [String],
            certifications: [String],
            availability: [String],
            issuer: [String],
        },
    },
    { timestamps: true }
);

// Index for faster queries
exportLogSchema.index({ user: 1, createdAt: -1 });
exportLogSchema.index({ role: 1, createdAt: -1 });
exportLogSchema.index({ createdAt: -1 });

const ExportLog = mongoose.model("ExportLog", exportLogSchema);
module.exports = ExportLog;
