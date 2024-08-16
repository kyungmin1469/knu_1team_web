const apiController = require("express").Router();
const userController = require("./user.controller");
const productController = require("./product.controller");
//const orderController = require("./order.controller");

apiController.use("/user", userController);
apiController.use("/product", productController);
//apiController.use("/order", orderController);

module.exports = apiController;
