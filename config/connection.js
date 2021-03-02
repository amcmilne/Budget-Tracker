const connectDB = require(process.env.URI || "../connection.env");

module.exports = connectDB;