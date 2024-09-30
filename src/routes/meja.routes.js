const express = require("express");
const meja = require("../controllers/meja");
const authorize = require("../middlewares/auth");
const adminValidator = require("../middlewares/admin-validator");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());


app.get("/", authorize.authorize, meja.selectAllMeja);
app.post("/", authorize.authorize, adminValidator.isAdmin, meja.addMeja);
app.delete("/drop/:id",authorize.authorize,adminValidator.isAdmin,meja.deleteMeja);

module.exports = app;