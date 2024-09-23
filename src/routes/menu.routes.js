const express = require("express");
const menu = require("../controllers/menu");
const authorize = require("../middlewares/auth");
const adminValidator = require("../middlewares/admin-validator");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.get("/", authorize.authorize, menu.getMenu);
app.get("/image/:filename", menu.getMenuImage);
app.get("/:search", authorize.authorize, menu.findMenu);
app.post("/", authorize.authorize, adminValidator.isAdmin, menu.addMenu);
app.put("/:id", authorize.authorize, adminValidator.isAdmin, menu.updateMenu);
app.delete("/:id", authorize.authorize, adminValidator.isAdmin, menu.deleteMenu);

module.exports = app;
