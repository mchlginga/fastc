const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// custom middleware
const errorHandling = require("./middlewares/errorHandling");

// utils
const ensureFileExist = require("./utils/ensureFileExist");
const { PATHS, statusCodes } = require("./utils/constant");

// routes
const auth = require("./routes/auth");

const app = express();

app.use(helmet());
app.use(express.json());

// morgan access logs
ensureFileExist(PATHS.logFile);
const accessLogStream = fs.createWriteStream(path.join(PATHS.logFile), { flags: 'a' });
app.use(morgan("combined", { stream: accessLogStream }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/auth", auth);

app.use( (req, res) => {
    res.status(statusCodes.NOT_FOUND).json({ message: "Invalid route." });
});

app.use(errorHandling);

module.exports = app;