const productController = require("express").Router();
const bannerController = require("express").Router();
const Product = require("../schema/product.schema");
const getProductList = require("../service/product.service");

// 상품 조회 api
// 1. 전부 all 뽑기
// 2. filter(조건)
// 3. 페이지 네이션 적용 -> list index
productController.get("/", async (req, res) => {
  const productlist = await getProductList();
  return res.json({ data: productlist });
});

productController.get("/:id", async (req, res) => {
  const productId = req.params.id;
  console.log({ productId });

  const product = await Product.findById(productId);
  console.log("product result => \n", { product });
  return res.json({ result: true, data: product });
});

module.exports = productController;
