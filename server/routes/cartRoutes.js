const express = require("express");

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

// Add product to cart
router.post("/", addToCart);

// Get user's cart
router.get("/:userId", getCart);

// Update product quantity
router.put("/", updateCartItem);

// Remove product from cart
router.delete("/", removeFromCart);

module.exports = router;