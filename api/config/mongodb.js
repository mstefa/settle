"use strict";

// Dependencies
const Mongoose = require("mongoose");


// Parameters
const dbHost = "localhost"
const dbPort = "27017"
const dbSchema = "settle"


Mongoose.connect("mongodb://"  + dbHost + ":" + dbPort+ "/" + dbSchema);

const db = Mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Connection with database succeeded");
});

module.exports = db;