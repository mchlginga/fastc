const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("./models/user");
require("./models/course");
require("./models/completion");

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
    match,
    completion,
    course,
} = require("./routes/index");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "data", "upload")));

// allow frontend and backend origins
app.use(
    cors({
        origin: [config.frontendUrl, "http://localhost:3000"],
        credentials: true,
    })
);

// morgan access logs
ensureFileExist(PATHS.logFile);
const accessLogStream = fs.createWriteStream(path.join(PATHS.logFile), {
    flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/upload", upload);
app.use("/api/certificates", certificate);
app.use("/api/job", job);
app.use("/api/match", match);
app.use("/api/completion", completion);
app.use("/api/courses", course);

app.use((req, res) => {
    res.status(statusCodes.NOT_FOUND).json({ message: "Invalid route." });
});

app.use(errorHandling);

module.exports = app;
