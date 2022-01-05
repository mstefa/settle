"use strict";

// Dependencies
const Mongoose = require("mongoose");

// Parameters
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbSchema = process.env.DB_SCHEMA


Mongoose.connect(
    "mongodb://"  + dbHost + ":" + dbPort+ "/" + dbSchema
    );

const db = Mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Connection with database succeeded");
});

module.exports = db;