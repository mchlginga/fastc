/* dependencies */
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/index");
const { statusCodes } = require("../utils/constant");

const protect = async (req, res, next) => {
    try {
        let token;

        // 🆕 ENHANCED: Check ALL possible token sources
        // 1. Authorization header (normal API calls)
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        // 🆕 ADD: Query parameter (for new tab scenarios)
        else if (req.query.token) {
            token = req.query.token;
        }
        // 2. Cookies
        else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "Not authorized, no token.",
            });
        }

        // verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "User not found.",
            });
        }
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);

        // 🆕 ADD: More specific error messages
        if (error.name === "JsonWebTokenError") {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "Not authorized, invalid token.",
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "Not authorized, token expired.",
            });
        }

        next(error);
    }
};

module.exports = protect;
