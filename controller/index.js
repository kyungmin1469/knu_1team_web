const apiController = require("express").Router();
const userController = require("./user.controller");
const productController = require("./product.controller");

apiController.use("/user", userController);
apiController.use("/product", productController);

module.exports = apiController;
