const express = require("express");
const user = require("../controllers/user");
const authorize = require("../middlewares/auth");
const adminValidator = require("../middlewares/admin-validator");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/", authorize.authorize, adminValidator.isAdmin, user.getAllUsers);
app.get("/:id", authorize.authorize, adminValidator.isAdmin, user.selectUsers);
app.post("/", authorize.authorize, adminValidator.isAdmin, user.addUser);
app.put("/role/:id", authorize.authorize, adminValidator.isAdmin, user.updateRole);
app.delete("/drop/:id", authorize.authorize, adminValidator.isAdmin, user.deleteUser);

module.exports = app;