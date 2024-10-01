const express = require("express");
const auth = require("../controllers/auth");
const authorize = require("../middlewares/auth");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.post("/signup", auth.register);
app.post("/login", auth.login);
app.put("/wrongpass", auth.wrongPassword)
app.post("/me", authorize.authorize, auth.me);

module.exports = app;
