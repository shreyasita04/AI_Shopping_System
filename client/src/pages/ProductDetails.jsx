import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";
const API_URL = import.meta.env.VITE_API_URL;

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

const [product, setProduct] = useState(null);
const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
const [reviewMessage, setReviewMessage] = useState("");
const [wishlistMessage, setWishlistMessage] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/products/${id}`
        );

        setProduct(response.data.product || response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reviews/product/${id}`
      );

      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Fetch reviews error:", error);
    }
  };

  fetchReviews();
}, [id]);

const handleSubmitReview = async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if (!userId) {
    setReviewMessage("Please login to submit a review.");
    return;
  }

  if (!comment.trim()) {
    setReviewMessage("Please write a comment.");
    return;
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/reviews`,
      {
        userId,
        productId: id,
        rating,
        comment,
      }
    );

    setReviewMessage(response.data.message);

    setComment("");

    // Refresh reviews
    const reviewsResponse = await axios.get(
  `${API_URL}/api/reviews/product/${id}`
);

setReviews(reviewsResponse.data.reviews || []);

const productResponse = await axios.get(
  `${API_URL}/api/products/${id}`
);

setProduct(productResponse.data.product || productResponse.data);
  } catch (error) {
    console.error("Submit review error:", error);

    setReviewMessage(
      error.response?.data?.message || "Failed to submit review."
    );
  }
};

const handleDeleteReview = async (reviewId) => {
  try {
    await axios.delete(
      `${API_URL}/api/reviews/${reviewId}`
    );

    setReviews((currentReviews) =>
      currentReviews.filter((review) => review._id !== reviewId)
    );

    const productResponse = await axios.get(
      `${API_URL}/api/products/${id}`
    );

    setProduct(productResponse.data.product || productResponse.data);
  } catch (error) {
    console.error("Delete review error:", error);
  }
};

const handleAddToWishlist = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if (!userId) {
    setWishlistMessage("Please login to add products to your wishlist.");
    return;
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/wishlist`,
      {
        userId,
        productId: id,
      }
    );

    setWishlistMessage(response.data.message);
  } catch (error) {
    console.error("Add to wishlist error:", error);

    setWishlistMessage(
      error.response?.data?.message || "Failed to add product to wishlist."
    );
  }
};

  if (loading) {
    return <h2 className="status-message">Loading product...</h2>;
  }

  if (error) {
    return <h2 className="status-message">{error}</h2>;
  }

  if (!product) {
    return <h2 className="status-message">Product not found.</h2>;
  }

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

<div className="details-image">
  <img
    src={
      product.image ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    }
    alt={product.name}
    onError={(e) => {
      e.currentTarget.src =
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80";
    }}
  />
</div>
        

        <div className="details-info">
          <h1>{product.name}</h1>

        <div className="product-rating">
        <span>⭐ {product.rating ? product.rating.toFixed(1) : "0.0"}</span>
        <span>
        ({product.numReviews || 0}{" "}
        {product.numReviews === 1 ? "review" : "reviews"})
        </span>
        </div>

        <h2>₹{product.price}</h2>
          <p>{product.description}</p>

          <p>
            <strong>Stock:</strong> {product.stock}
          </p>

          <button
  className="add-cart-button"
  onClick={() => addToCart(product)}
>
  Add to Cart
</button>
<button
  className="wishlist-button"
  onClick={handleAddToWishlist}
>
  ♡ Add to Wishlist
</button>

{wishlistMessage && (
  <p className="wishlist-message">{wishlistMessage}</p>
)}
        </div>
        <div className="reviews-section">
          <div className="review-form">
  <h3>Write a Review</h3>

  <form onSubmit={handleSubmitReview}>
    <label>Rating</label>

    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
    >
      <option value={5}>5 - Excellent</option>
      <option value={4}>4 - Very Good</option>
      <option value={3}>3 - Good</option>
      <option value={2}>2 - Average</option>
      <option value={1}>1 - Poor</option>
    </select>

    <label>Comment</label>

    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Write your review..."
      rows="4"
    />

    <button type="submit">Submit Review</button>

    {reviewMessage && <p>{reviewMessage}</p>}
  </form>
</div>
    <h2>Customer Reviews</h2>

    {reviews.length === 0 ? (
      <p>No reviews yet.</p>
    ) : (
      <div className="reviews-list">
        {reviews.map((review) => (
<div className="review-card" key={review._id}>
  <div className="review-header">
    <strong>{review.user?.name || "Customer"}</strong>

    <span>
      {"⭐".repeat(review.rating)}
    </span>
  </div>

  <p>{review.comment}</p>

  <small>
    {new Date(review.createdAt).toLocaleDateString()}
  </small>

  <button
    className="delete-review-button"
    onClick={() => handleDeleteReview(review._id)}
  >
    Delete Review
  </button>
</div>
        ))}
      </div>
    )}
  </div>
      </div>
  );
}

export default ProductDetails;