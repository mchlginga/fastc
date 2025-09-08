const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// config 
const config = require("./config/index");

// custom middleware
const errorHandling = require("./middlewares/errorHandling");

// utils
const ensureFileExist = require("./utils/ensureFileExist");
const { PATHS, statusCodes } = require("./utils/constant");

// routes
const {
    auth,
    user,
    upload,
    certificate,
    job,
    match
} = require("./routes/index");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// allow frontend to send tsaka recieve cookies
app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true
    })
);

// morgan access logs
ensureFileExist(PATHS.logFile);
const accessLogStream = fs.createWriteStream(path.join(PATHS.logFile), { flags: 'a' });
app.use(morgan("combined", { stream: accessLogStream }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/upload", upload);
app.use("/api/certificate", certificate);
app.use("/api/job", job);
app.use("/api/match", match);

app.use( (req, res) => {
    res.status(statusCodes.NOT_FOUND).json({ message: "Invalid route." });
});

app.use(errorHandling);

module.exports = app;