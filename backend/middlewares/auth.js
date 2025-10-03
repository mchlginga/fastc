const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/index");
const { statusCodes } = require("../utils/constant");

const protect = async (req, res, next) => {
    try {
        let token;
        // Check Authorization header first
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "Not authorized, no token.",
            });
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "User not found.",
            });
        }

        next();
    } catch (error) {
        res.status(statusCodes.UNAUTHORIZED).json({
            message: "Not authorized, token failed.",
        });
    }
};

module.exports = protect;
