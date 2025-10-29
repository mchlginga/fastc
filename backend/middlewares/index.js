const protect = require("./auth");
const checkRoles = require("./role");
const { upload, uploadCourse } = require("./upload");

module.exports = {
    protect,
    checkRoles,
    upload,
    uploadCourse,
};
