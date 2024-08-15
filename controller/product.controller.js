const {
  getProductList,
  getProductById,
} = require("../service/product.service");

const productController = require("express").Router();

//상품 조회 api
//1) 전체 싹 다 뽑는다.
//2) 필터(조건)를 적용한다.
//3) 페이지네이션 적용

// 상품 목록 조회 API
productController.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      filter: category ? { category } : {},
    };

    const productList = await getProductList(options);
    return res.json({ result: true, data: productList });
  } catch (error) {
    console.error("Error fetching product list:", error);
    return res.status(500).json({ result: false, message: "서버 오류" });
  }
});

// 특정 상품 조회 API
productController.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id; // URL 파라미터에서 ID 가져오기
    const product = await getProductById(productId); // ID로 상품 조회

    if (!product) {
      return res
        .status(404)
        .json({ result: false, message: "상품을 찾을 수 없습니다." });
    }

    return res.json({ result: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ result: false, message: "서버 오류" });
  }
});

module.exports = productController;
