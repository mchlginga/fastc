const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    certificates: [
        {
            name: String,
            issuedAt: Date,
            expiresAt: Date
        }
    ],

    role: {
        type: String,
        enum: ["admin", "company", "user"],
        default: "user"
    },

    profilePic: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.matchPassword = (async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
});

const User = mongoose.model("User", userSchema);
module.exports = User;