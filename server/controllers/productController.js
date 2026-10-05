const Product = require("../models/Product");

// Add a new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      image,
      stock,
      rating,
      numReviews,
    } = req.body;

    // Check required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Please provide name, description, price and category",
      });
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      image,
      stock,
      rating,
      numReviews,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
};