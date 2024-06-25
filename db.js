const mongoose = require("mongoose");

// Connection URL
let URL = "mongodb://127.0.0.1:27017/practice";

// Set up MongoDB Connection
mongoose.connect(URL);

const db = mongoose.connection;

// Here "connected", "error", "disconnected" are reserved word by mongoose
// "on" is event listener
db.on('connected', () => {
    console.log('Connected to MongoDB server');
})

db.on('error', (err) => {
    console.log('MongoDB connection error', err);
})

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
})

module.exports = db;