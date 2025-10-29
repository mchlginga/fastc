/* dependencies */
const jwt = require("jsonwebtoken");
const config = require("../config/index");

// generate token function
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
};

module.exports = generateToken;
