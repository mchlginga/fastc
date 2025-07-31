const mongoose = require("mongoose");

const config = require("./index");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri);
        console.log("MongoDB successfully connected.");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;