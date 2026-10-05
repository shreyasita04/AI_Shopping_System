const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();
console.log("PRODUCT ROUTES LOADED");

// Create a product
router.post("/", createProduct);

// Get all products
router.get("/", getProducts);

// Get product by ID
router.get("/:id", getProductById);

module.exports = router;