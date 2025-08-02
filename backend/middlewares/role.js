const { statusCodes } = require("../utils/constant");

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(statusCodes.UNAUTHORIZED).json({ message: "Not authorized." });
        }

        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(req.user.role)) {
            res.status(statusCodes.FORBIDDEN).json( { message: "Access denied" });
        }

        next();
    };
};

module.exports = checkRole;