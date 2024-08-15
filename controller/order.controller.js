//order.controller.js
const { createOrder, getOrderById } = require("../service/order.service");

// 주문 생성 요청 처리
const handleCreateOrder = async (req, res) => {
  try {
    const orderData = req.body; // 요청 본문에서 주문 데이터 가져오기
    const newOrder = await createOrder(orderData);
    res.status(201).json(newOrder); // 주문 생성 성공 시 201 상태 코드와 함께 응답
  } catch (err) {
    console.error("Error handling create order request:", err);
    res.status(500).json({ message: "Error creating order" }); // 서버 오류 발생 시 500 상태 코드와 함께 응답
  }
};

// 주문 조회 요청 처리
const handleGetOrderById = async (req, res) => {
  try {
    const orderId = req.params.id; // URL 파라미터에서 주문 ID 가져오기
    const order = await getOrderById(orderId);
    if (order) {
      res.status(200).json(order); // 주문 조회 성공 시 200 상태 코드와 함께 응답
    } else {
      res.status(404).json({ message: "Order not found" }); // 주문이 존재하지 않을 경우 404 상태 코드와 함께 응답
    }
  } catch (err) {
    console.error("Error handling get order request:", err);
    res.status(500).json({ message: "Error fetching order" }); // 서버 오류 발생 시 500 상태 코드와 함께 응답
  }
};

module.exports = {
  handleCreateOrder,
  handleGetOrderById,
};