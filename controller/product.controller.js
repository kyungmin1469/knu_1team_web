//팀장용
const Product = require("../schema/product.schema");
const { getProductList } = require("../service/product.service");
const productController = require("express").Router();

// const dummyData = Array.from({ length: 30 }, (_, index) => {
//   const product = {
//     productId: index,
//     title: `product-title-${index + 1}`,
//     price: Math.floor(Math.random() * 90000) + 10000, // 10,000~ 100,000
//     description: `product-description-${index + 1}`,
//     imgUrl: `https://picsum.photos/id/${index + 1}/200/300`,
//     stock: Math.ceil(Math.random() * 100),
//   };
//   return product;
// });
//상품 조회 api
// 1) 전체 싹 다 뽑는다.
// 2) 필터(조건)
// 3) 페이지네이션 적용
productController.get("/", (req, res) => {
  // 상품 전체 조회
  // 가져온 데이터를 res.json({})에 실어서 클라이언트로 보내준다.
  const ProductList = getProductList();
  return res.json({ result: true, data: productList });
});

// productController.get("/insert-dummy", async (_, res) => {
//   for (const product of dummyData) {
//     const result = await Product.create(product);
//     console.log(result);
//   }
//   return res.json({ result: true });
// });

module.exports = productController;
