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

bannerController.get("/:id", async (req, res) => {
  try {
    const slider = await Product.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: "이미지를 찾을 수 없습니다." });
    }
    res.json({ data: slider });
  } catch (error) {
    res.status(500).json({ message: "서버 오류", error });
  }
});

module.exports = productController;
