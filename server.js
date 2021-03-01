require('dotenv').config();
const express = require("express");
const logger = require("morgan");
//const mongoose = require("mongoose");
const compression = require("compression");
const connectDB = require ("./config/connection");

connectDB();
// Sets up the Express App
// =============================================================

const PORT = process.env.PORT || 3000;
const app = express();

// Sets up the Express app to handle data parsing
//===============================================================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(logger("dev"));

app.use(compression());

mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// Sets up required routes
// =============================================================
app.use(require("./routes/api.js"));

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});