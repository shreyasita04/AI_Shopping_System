const express = require("express");

const {
  createReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);

router.get("/product/:productId", getProductReviews);

router.delete("/:reviewId", deleteReview);

module.exports = router;