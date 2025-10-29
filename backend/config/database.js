const mongoose = require("mongoose");
const config = require("./index");

const connectDB = async () => {
    try {
        console.log("Trying to connect to:", config.mongoUri); // debug log
        const conn = await mongoose.connect(config.mongoUri);

        // log the actual DB name
        console.log("MongoDB connected to:", conn.connection.name);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
