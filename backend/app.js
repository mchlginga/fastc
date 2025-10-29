/* --- dependencies --- */

// third party middlewares
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// built in modules
const path = require("path");
const fs = require("fs");

// local modules
const errorHandling = require("./middlewares/errorHandling");
const ensureFileExist = require("./utils/ensureFileExist");
const { PATHS, statusCodes } = require("./utils/constant");
const config = require("./config/index");

// models
require("./models/user");
require("./models/course");
require("./models/completion");
require("./models/exportLog");
require("./models/attendance");

const {
    auth,
    user,
    courses,
    enrollment,
    certificate,
    progress,
    attendance,
    adminUsers,
    adminCourses,
    adminEnrollments,
    adminCertificates,
    match,
    statistics,
    // upload,
    // certificate,
    // completion,
    // course,
    // match,
    // ,
} = require("./routes/index");

const app = express();

/* --- global middlewares--- */
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// allow frontend and backend origins
app.use(
    cors({
        origin: config.frontendUrl || "https://fastc.vercel.app",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"],
    })
);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "data", "upload"), {
        setHeaders: (res, path) => {
            res.setHeader("Access-Control-Allow-Origin", config.frontendUrl);
            res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        },
    })
);

// morgan access logs
ensureFileExist(PATHS.logFile);
const accessLogStream = fs.createWriteStream(path.join(PATHS.logFile), {
    flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));
if (config.env === "development") {
    app.use(morgan("dev"));
}

/* --- mount route modules ---  */
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/courses", courses);
app.use("/api/enrollment", enrollment);
app.use("/api/certificate", certificate);
app.use("/api/progress", progress);
app.use("/api/attendance", attendance);
app.use("/api/admin", adminUsers);
app.use("/api/admin", adminCourses);
app.use("/api/admin", adminEnrollments);
app.use("/api/admin", adminCertificates);
app.use("/api/match", match);
app.use("/api/statistics", statistics);

// app.use("/api/upload", upload);
// app.use("/api/certificates", certificate);
// app.use("/api/completion", completion);
// app.use("/api/courses", course);
// app.use("/api/match", match);

// invalid route destination
app.use((req, res) => {
    res.status(statusCodes.NOT_FOUND).json({ message: "Invalid route." });
});

app.use(errorHandling);

module.exports = app;
