const productController = require("express").Router();

// 상품 조회 api
// 1. 전부 all 뽑기
// 2. filter(조건)
// 3. 페이지 네이션 적용 -> list index

const dummyData = Array.from({ length: 30 }, (_, index) => {
  const product = {
    _id: index,
    title: `product-title-${index + 1}`,
    price: Math.floor(Math.random() * 90000) + 10000,
    description: `product-title-${
      index + 1
    } 에 대한 desription이 들어가는 layout 입니다.`,
    imgUrl: `https://picsum.photos/id/${index + 1}/200/300`,
    stock: Math.ceil(Math.random() * 100),
  };
  return product;
});

productController.get("/", (req, res) => {
  return res.json({ result: true, data: dummyData });
});

module.exports = productController;
