const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
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
        requestedAt: {
            type: Date,
            default: Date.now,
        },

        enrolledAt: {
            type: Date,
            default: null,
        },
        accessUntil: {
            type: Date,
            default: null,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        status: {
            type: String,
            enum: ["pending", "active", "completed", "cancelled", "expired"],
            default: "pending",
        },
        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        completedAt: {
            type: Date,
        },
        lastAccessedLesson: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

// 🆕 ADD: Virtual for checking if access has expired
enrollmentSchema.virtual("hasExpired").get(function () {
    if (!this.accessUntil) return false; // Self-paced never expires
    return new Date() > this.accessUntil;
});

// 🆕 ADD: Virtual for days remaining
enrollmentSchema.virtual("daysRemaining").get(function () {
    if (!this.accessUntil) return null; // Self-paced

    const now = new Date();
    const timeDiff = this.accessUntil - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysRemaining > 0 ? daysRemaining : 0;
});

// 🆕 ADD: Method to check if course can be accessed
enrollmentSchema.methods.canAccess = function () {
    if (this.status !== "active") return false;
    if (this.hasExpired) return false;
    return true;
};

// 🆕 ADD: Middleware to auto-expire enrollments
enrollmentSchema.pre("save", function (next) {
    if (
        this.accessUntil &&
        new Date() > this.accessUntil &&
        this.status === "active"
    ) {
        this.status = "expired";
    }
    next();
});

// Prevent duplicate active enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;
