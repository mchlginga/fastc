const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: false,
            unique: true,
            trim: true,
            sparse: true,
        },
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
        companyName: {
            type: String,
            required: function () {
                return this.role === "company";
            },
            trim: true,
        },
        name: {
            type: String,
            trim: true,
        },
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
        profilePic: {
            type: String,
            default: "",
        },
        privacyAgreement: {
            type: Boolean,
            required: true,
            default: false,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
        verificationCode: String,
        verificationCodeExpires: Date,
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        birthdate: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        contactNumber: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        education: [
            {
                educationLevel: { type: String, trim: true },
                schoolName: { type: String, trim: true },
                yearGraduated: { type: String, trim: true },
                proof: { type: String }, // Path to uploaded file
            },
        ],
        certificates: [
            {
                name: { type: String, trim: true },
                issuer: { type: String, trim: true },
                date: { type: Date },
                expiration: { type: Date },
                proof: { type: String }, // Path to uploaded file
            },
        ],
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        availability: {
            type: String,
            enum: ["Full-time", "Part-time", "N/A"],
            default: "N/A",
        },
        industryType: {
            type: String,
        },
        businessPermit: {
            type: String,
        },
        representative: {
            name: { type: String },
            position: { type: String },
            contactNumber: { type: String },
            idProof: { type: String },
        },
        profileStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        isProfileComplete: {
            type: Boolean,
            default: false,
            get: function () {
                if (this.role === "admin") {
                    return !!(
                        this.username &&
                        this.position &&
                        this.contactNumber
                    );
                } else if (this.role === "user") {
                    return !!(
                        this.username &&
                        this.birthdate &&
                        this.gender &&
                        this.contactNumber &&
                        this.address &&
                        this.education.some((edu) =>
                            ["highSchool", "senioHighSchool"].includes(
                                edu.educationLevel
                            )
                        )
                    );
                } else if (this.role === "company") {
                    return !!(
                        this.companyName &&
                        this.industryType &&
                        this.address &&
                        this.contactNumber &&
                        this.representative &&
                        this.representative.name &&
                        this.representative.position &&
                        this.representative.contactNumber
                    );
                }
                return false;
            },
        },
        lastActive: {
            type: Date,
            default: null, // Tracks last user activity
        },
    },
    {
        timestamps: true,
    }
);

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

const User = mongoose.model("User", userSchema);
module.exports = User;
