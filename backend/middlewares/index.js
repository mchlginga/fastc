const protect = require("./auth");
const checkRoles = require("./role");
const upload = require("./upload");

module.exports = {
    protect,
    checkRoles,
    upload
};