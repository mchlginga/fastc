// backend/models/user.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        /* --- authorization --- */
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["superAdmin", "admin", "company", "user"],
            default: "user",
        },
        privacyAgreement: {
            type: Boolean,
            required: true,
            default: false,
        },

        /* --- personal details  --- */
        firstName: {
            type: String,
            required: function () {
                return this.role !== "company";
            },
            trim: true,
        },
        surname: {
            type: String,
            required: function () {
                return this.role !== "company";
            },
            trim: true,
        },
        name: {
            type: String,
            trim: true,
        },
        profileStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        lastActive: {
            type: Date,
            default: null,
        },

        companyName: {
            type: String,
            required: function () {
                return this.role === "company";
            },
            trim: true,
        },

        // 🆕 UPDATED: Skills now come from certificates only (virtual field)
        // ❌ REMOVED: skills: [String]

        availability: {
            type: String,
            enum: ["Full-time", "Part-time", "N/A"],
            default: "N/A",
        },

        profilePic: {
            type: String,
            default: "",
        },

        /* --- verification --- */
        verificationCode: {
            type: String,
        },
        verificationCodeExpires: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        /* --- profiling --- */
        birthdate: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        education: [
            {
                educationLevel: {
                    type: String,
                    trim: true,
                },
                schoolName: {
                    type: String,
                    trim: true,
                },
                yearGraduated: {
                    type: String,
                    trim: true,
                },
                proof: {
                    type: String,
                },
            },
        ],

        // facial recognitoin
        faceData: {
            faceToken: {
                type: String,
                default: null,
            },
            enrolledAt: {
                type: Date,
                default: null,
            },
            lastVerified: {
                type: Date,
                default: null,
            },
        },

        representative: {
            name: {
                type: String,
            },
            email: {
                type: String,
            },
            contactNumber: {
                type: String,
            },
        },
        businessPermit: {
            type: String,
        },

        address: {
            type: String,
            trim: true,
        },
        contactNumber: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// 🆕 NEW: Virtual field for certificates (from Certificate collection)
userSchema.virtual("certificates", {
    ref: "Certificate",
    localField: "_id",
    foreignField: "user",
    justOne: false,
});

// Pre-save middleware
userSchema.pre("save", async function (next) {
    if (
        this.isModified("firstName") ||
        this.isModified("surname") ||
        this.isModified("companyName")
    ) {
        if (this.role === "company") {
            this.name = this.companyName || "";
        } else {
            this.name = `${this.firstName || ""} ${this.surname || ""}`.trim();
        }
    }

    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🆕 NEW: Get all verified skills from certificates
userSchema.methods.getSkills = async function () {
    try {
        const Certificate = require("./certificate");
        const Skill = require("./skill");

        const certificates = await Certificate.find({
            user: this._id,
            status: "active",
        }).populate("verifiedSkills.skill");

        // Extract unique skills with level and certificate count
        const skillMap = new Map();

        certificates.forEach((cert) => {
            if (cert.verifiedSkills && cert.verifiedSkills.length > 0) {
                cert.verifiedSkills.forEach((vs) => {
                    if (vs.skill) {
                        const skillId = vs.skill._id.toString();

                        if (!skillMap.has(skillId)) {
                            skillMap.set(skillId, {
                                skill: vs.skill,
                                level: vs.level,
                                certificateCount: 1,
                                verifiedAt: vs.verifiedAt,
                            });
                        } else {
                            const existing = skillMap.get(skillId);
                            existing.certificateCount++;

                            // Keep highest level
                            if (
                                levelRank(vs.level) > levelRank(existing.level)
                            ) {
                                existing.level = vs.level;
                            }

                            // Keep earliest verification date
                            if (
                                new Date(vs.verifiedAt) <
                                new Date(existing.verifiedAt)
                            ) {
                                existing.verifiedAt = vs.verifiedAt;
                            }
                        }
                    }
                });
            }
        });

        return Array.from(skillMap.values());
    } catch (error) {
        console.error("Error getting user skills:", error);
        return [];
    }
};

// 🆕 NEW: Sync skills from certificates (for backward compatibility)
userSchema.methods.syncSkillsFromCertificates = async function () {
    try {
        // This method exists for backward compatibility
        // Skills are now fetched dynamically using getSkills()
        const skills = await this.getSkills();
        console.log(`✅ User ${this._id} has ${skills.length} verified skills`);
        return skills;
    } catch (error) {
        console.error("Error syncing skills from certificates:", error);
        return [];
    }
};

// ❌ REMOVED: updateSkillsFromCertificates (replaced by getSkills)

// Helper function for skill level ranking
function levelRank(level) {
    const ranks = { beginner: 1, intermediate: 2, advanced: 3 };
    return ranks[level] || 0;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
