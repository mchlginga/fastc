module.exports = {
    env: "development",
    port: process.env.PORT || 3000,
    dbName: process.env.DB_NAME || "fastc_dev",
    mongoUri: process.env.MONGO_URI
}; 