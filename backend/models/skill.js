// backend/models/skill.js
const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            // Categories: "Construction & Trades", "Beauty & Wellness",
            // "Hospitality & Food Service", "Technology & IT", "Arts & Crafts"
        },
        aliases: [
            {
                type: String,
                trim: true,
            },
        ],
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        description: {
            type: String,
            trim: true,
        },
        relatedCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Text index for search functionality
skillSchema.index({ name: "text", aliases: "text" });

// Index for filtering
skillSchema.index({ category: 1, isActive: 1 });

// Method to check if a string matches this skill
skillSchema.methods.matchesString = function (searchString) {
    const search = searchString.toLowerCase().trim();

    // Check name
    if (this.name.toLowerCase().includes(search)) return true;

    // Check aliases
    return this.aliases.some((alias) => alias.toLowerCase().includes(search));
};

// Static method to find skill by name or alias
skillSchema.statics.findByNameOrAlias = async function (searchString) {
    const search = searchString.toLowerCase().trim();

    return await this.findOne({
        $or: [
            { name: { $regex: new RegExp(`^${search}$`, "i") } },
            { aliases: { $regex: new RegExp(`^${search}$`, "i") } },
        ],
        isActive: true,
    });
};

const Skill = mongoose.model("Skill", skillSchema);
module.exports = Skill;
