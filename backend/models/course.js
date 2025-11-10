// backend/models/course.js
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
        category: {
            type: String,
            trim: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        skillLevel: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        enrollmentPeriod: {
            type: Number,
            default: 0,
            min: 0,
            validate: {
                validator: function (value) {
                    return value >= 0;
                },
                message: "Enrollment period must be 0 or positive number",
            },
        },
        endDate: {
            type: Date,
            default: null,
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    return value > new Date();
                },
                message: "End date must be in the future",
            },
        },
        lessons: [
            {
                title: {
                    type: String,
                    trim: true,
                    required: true,
                },
                duration: {
                    type: String,
                    trim: true,
                },
                order: {
                    type: Number,
                    required: true,
                },
                content: {
                    type: String,
                    trim: true,
                },
                isRequired: {
                    type: Boolean,
                    default: true,
                },
            },
        ],
        requirements: [
            {
                type: String,
                trim: true,
            },
        ],
        outcomes: [
            {
                type: String,
                trim: true,
            },
        ],

        skillsTaught: [
            {
                skill: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Skill",
                    required: true,
                },
                level: {
                    type: String,
                    enum: ["beginner", "intermediate", "advanced"],
                    default: "beginner",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Virtual for course type
courseSchema.virtual("isSelfPaced").get(function () {
    return this.enrollmentPeriod === 0;
});

// Method to calculate access until date
courseSchema.methods.calculateAccessUntil = function (enrollmentDate) {
    if (this.isSelfPaced) {
        return null;
    }

    const accessUntil = new Date(enrollmentDate);
    accessUntil.setDate(accessUntil.getDate() + this.enrollmentPeriod);
    return accessUntil;
};

// Method to check if enrollment is allowed
courseSchema.methods.canEnroll = function () {
    const now = new Date();

    if (!this.isActive) return false;

    if (this.endDate && now > this.endDate) return false;

    return true;
};

// 🆕 NEW: Middleware to update related skills
courseSchema.pre("save", async function (next) {
    if (this.isModified("skillsTaught") && this.skillsTaught.length > 0) {
        const Skill = require("./skill");

        // Update relatedCourses in each skill
        for (const st of this.skillsTaught) {
            await Skill.findByIdAndUpdate(st.skill, {
                $addToSet: { relatedCourses: this._id },
            });
        }
    }
    next();
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
