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
            required: true,
            trim: true,
        },
        surname: {
            type: String,
            required: true,
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
            enum: ["admin", "company", "user"],
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
            type: String,
        },
        gender: {
            type: String,
        },
        contactNumber: {
            type: String,
        },
        address: {
            type: String,
        },
        education: [
            {
                educationLevel: { type: String },
                schoolName: { type: String },
                yearGraduated: { type: String },
                proof: { type: String },
            },
        ],
        certificates: [
            {
                name: { type: String },
                issuer: { type: String },
                date: { type: String },
                proof: { type: String },
            },
        ],
        profileStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("firstName") || this.isModified("surname")) {
        this.name = `${this.firstName} ${this.surname}`.trim();
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
