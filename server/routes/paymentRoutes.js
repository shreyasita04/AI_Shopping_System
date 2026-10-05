const express = require("express");

const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Create payment
router.post("/", createPayment);

// Get all payments
router.get("/", getPayments);

// Get payment by ID
router.get("/:id", getPaymentById);

// Update payment
router.put("/:id", updatePayment);

// Delete payment
router.delete("/:id", deletePayment);

module.exports = router;