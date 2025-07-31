module.exports = {
    env: "production",
    port: process.env.PORT || 5000,
    dbName: process.env.DB_NAME || "fastc_prod",
    mongoUri: process.env.MONGO_URI
};