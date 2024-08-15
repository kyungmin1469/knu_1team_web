const Product = require("../schema/product.schema");

// 전체 상품 목록 가져오기
const getProductList = async (options) => {
  const { page, limit, filter } = options;

  const products = await Product.find(filter)
    .skip((page - 1) * limit) // 페이지네이션
    .limit(limit); // 페이지당 상품 수

  return products;
};

// 특정 상품 가져오기
const getProductById = async (id) => {
  try {
    const product = await Product.findById(id); // ID로 상품 조회
    return product;
  } catch (error) {
    console.error("상품 조회 중 오류 발생:", error);
    throw error; // 에러 발생 시 다시 던지기
  }
};

module.exports = {
  getProductList,
  getProductById,
};
