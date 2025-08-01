module.exports = {
    env: "development",
    port: process.env.PORT || 3000,
    dbName: process.env.DB_NAME || "fastc_dev",
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d"
}; 