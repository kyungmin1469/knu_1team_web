const apiController = require("express").Router();
const userController = require("./user.controller");

apiController.use("/user", userController);

module.exports = apiController;