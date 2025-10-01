const jwt = require("jsonwebtoken");
const User = require("../models/user");

const config = require("../config/index");
const { statusCodes } = require("../utils/constant");

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "Not authorized, no token.",
            });
        }

        const decoded = jwt.verify(token, config.jwtSecret);

        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        res.status(statusCodes.UNAUTHORIZED).json({
            message: "Not authorized, token failed.",
        });
    }
};

module.exports = protect;
