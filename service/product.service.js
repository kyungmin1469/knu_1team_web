const Product = require("../schema/product.schema");

const getProductList = async () => {
  //Product 모델을 통해 , MongoDb에서 데이터를 가져와야함
  const productList = await Product.find({});
  console.log(productList);
  return productList;
};

module.exports = {
  getProductList,
};
