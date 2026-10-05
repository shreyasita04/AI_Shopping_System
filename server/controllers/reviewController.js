const Review = require("../models/Review");
const Product = require("../models/Product");

// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || !rating || !comment) {
      return res.status(400).json({
        message: "Please provide userId, productId, rating and comment",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0
    );

    product.rating = totalRating / reviews.length;
    product.numReviews = reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET REVIEWS FOR A PRODUCT
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(reviewId);

    // Recalculate product rating
    const remainingReviews = await Review.find({
      product: productId,
    });

    const product = await Product.findById(productId);

    if (product) {
      if (remainingReviews.length === 0) {
        product.rating = 0;
        product.numReviews = 0;
      } else {
        const totalRating = remainingReviews.reduce(
          (total, review) => total + review.rating,
          0
        );

        product.rating = totalRating / remainingReviews.length;
        product.numReviews = remainingReviews.length;
      }

      await product.save();
    }

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};