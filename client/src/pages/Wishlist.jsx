import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./Wishlist.css";
const API_URL = import.meta.env.VITE_API_URL;

function Wishlist() {
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/wishlist/${userId}`
        );

        setWishlist(response.data.wishlist?.products || []);
      } catch (error) {
        console.error("Fetch wishlist error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/wishlist`, {
        data: {
          userId,
          productId,
        },
      });

      setWishlist((currentWishlist) =>
        currentWishlist.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Remove from wishlist error:", error);
    }
  };

  if (loading) {
    return <h2>Loading wishlist...</h2>;
  }

  if (!userId) {
    return <h2>Please login to view your wishlist.</h2>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h1>My Wishlist</h1>
        <p>Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div className="wishlist-card" key={product._id}>
            <Link to={`/products/${product._id}`}>
              <h2>{product.name}</h2>
            </Link>

            <p className="wishlist-price">₹{product.price}</p>

            <div className="wishlist-buttons">
              <button
                className="wishlist-cart-button"
                type="button"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>

              <button
                className="wishlist-remove-button"
                type="button"
                onClick={() => handleRemoveFromWishlist(product._id)}
              >
                Remove from Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;