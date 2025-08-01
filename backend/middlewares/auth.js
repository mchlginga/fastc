const jwt = require("jsonwebtoken");
const User = require("../models/user");

const config = require("../config/index");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = await jwt.verify(token, config.jwtSecret);

            req.user = await User.findById(decoded.id).select("-password");

            next();
            
        } catch (error) {
            next(error);
        }
    }
};

module.exports = protect;