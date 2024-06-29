const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require("body-parser");
require('dotenv').config();
const passport = require("./auth");

const MenuItem = require("./models/MenuItem");
const PORT = process.env.PORT || 8000;

// Middleware function for log
const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} Request made to: ${req.originalUrl}`);
    next();
}

app.use(logRequest);
app.use(bodyParser.json());

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', { session: false });

app.get("/", function (req, res) {
    res.send({ msg: "Welcome to our Hotel..." })
});

// Import the route files
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require('./routes/menuRoutes');

app.use('/person', personRoutes);
app.use('/menu', menuRoutes);

app.listen(PORT);