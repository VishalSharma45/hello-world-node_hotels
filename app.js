const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require("body-parser");

const MenuItem = require("./models/MenuItem");

app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send({ msg: "Welcome to our Hotel..." })
});

// Import the route files
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require('./routes/menuRoutes');

app.use('/person', personRoutes);
app.use('/menu', menuRoutes);

app.listen(8000);