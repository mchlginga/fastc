// backend/models/certificate.js
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
        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
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
        issuedBy: {
            type: String,
            default: "FAST-C",
        },
        certificateUrl: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "expired", "revoked"],
            default: "active",
        },
        verificationCode: {
            type: String,
            unique: true,
            sparse: true,
        },

        // 🆕 NEW: Verified skills from this certificate
        verifiedSkills: [
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
                verifiedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
certificateSchema.index({ user: 1, course: 1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ completionDate: -1 });
certificateSchema.index({ expirationDate: 1 });
certificateSchema.index({ "verifiedSkills.skill": 1 });

// Virtual for checking if certificate is valid
certificateSchema.virtual("isValid").get(function () {
    if (this.status !== "active") return false;
    return new Date() <= new Date(this.expirationDate);
});

// Virtual for days until expiration
certificateSchema.virtual("daysUntilExpiration").get(function () {
    const now = new Date();
    const expiration = new Date(this.expirationDate);
    const timeDiff = expiration - now;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
});

// 🆕 NEW: Middleware to auto-populate skills from course
certificateSchema.pre("save", async function (next) {
    // Only populate skills when certificate is first created
    if (
        this.isNew &&
        (!this.verifiedSkills || this.verifiedSkills.length === 0)
    ) {
        try {
            const Course = require("./course");
            const course = await Course.findById(this.course).populate(
                "skillsTaught.skill"
            );

            if (
                course &&
                course.skillsTaught &&
                course.skillsTaught.length > 0
            ) {
                this.verifiedSkills = course.skillsTaught.map((st) => ({
                    skill: st.skill._id,
                    level: st.level,
                    verifiedAt: this.completionDate || new Date(),
                }));

                console.log(
                    `✅ Auto-populated ${this.verifiedSkills.length} verified skills for certificate`
                );
            } else {
                console.warn(`⚠️ Course ${this.course} has no skills defined`);
            }
        } catch (error) {
            console.error("❌ Error auto-populating skills:", error);
            // Don't block certificate creation if skill population fails
        }
    }

    next();
});

// 🆕 NEW: Middleware to update user skills when certificate is created/updated
certificateSchema.post("save", async function (doc) {
    if (doc.status === "active" && doc.verifiedSkills.length > 0) {
        try {
            const User = require("./user");
            const user = await User.findById(doc.user);

            if (user && typeof user.syncSkillsFromCertificates === "function") {
                await user.syncSkillsFromCertificates();
                console.log(`✅ Synced skills for user ${doc.user}`);
            }
        } catch (error) {
            console.error("❌ Error syncing user skills:", error);
        }
    }
});

// Middleware to auto-expire certificates
certificateSchema.pre("save", function (next) {
    if (
        this.status === "active" &&
        new Date() > new Date(this.expirationDate)
    ) {
        this.status = "expired";
    }
    next();
});

const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;
