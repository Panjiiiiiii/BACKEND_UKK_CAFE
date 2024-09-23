const express = require("express");
const cart = require("../controllers/keranjang");
const authorize = require("../middlewares/auth");
const kasirValidator = require("../middlewares/kasir-validator");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/", authorize.authorize, kasirValidator.isKasir, cart.getCart);
app.get("/:id", authorize.authorize, kasirValidator.isKasir, cart.findCart);
app.post("/", authorize.authorize, kasirValidator.isKasir, cart.addItemCart);
app.put('/:id', authorize.authorize, kasirValidator.isKasir, cart.changeQuantity);
app.delete('/:id', authorize.authorize, kasirValidator.isKasir, cart.deleteItem);

module.exports = app