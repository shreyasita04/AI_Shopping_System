const express = require("express");

const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);

router.get("/user/:userId", getUserOrders);

router.get("/:orderId", getOrderById);

router.put("/status", updateOrderStatus);

module.exports = router;