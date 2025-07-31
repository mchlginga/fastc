require("dotenv").config();

const dev = require("./dev");
const prod = require("./prod");

const env = process.env.NODE_ENV || "development";

const config = env === "development" ? dev : prod;

module.exports = config;