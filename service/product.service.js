const Product = require("../schema/product.schema");

const getProductList = () => {
  // Product 모델을 통해, MongoDB에서 데이터를 가져와야함.
  const ProductList = Product; //Mongoose 에서 데이터 다량으로 가져오는 법
  return ProductList;
};

module.exports = {
  getProductList,
};
