//order.service.js
const Order = require("../schema/order.schema");

// 주문 생성
const createOrder = async (orderData) => {
  try {
    // Order 모델을 사용하여 새로운 주문을 생성
    const newOrder = await Order.create(orderData);
    return newOrder;
  } catch (err) {
    console.error("Error creating order:", err);
    throw err; // 에러를 호출자에게 전달
  }
};

// 주문 조회
const getOrderById = async (orderId) => {
  try {
    // 주어진 orderId를 사용하여 주문을 조회
    const order = await Order.findById(orderId);
    return order;
  } catch (err) {
    console.error("Error fetching order:", err);
    throw err; // 에러를 호출자에게 전달
  }
};

module.exports = {
  createOrder,
  getOrderById,
};
