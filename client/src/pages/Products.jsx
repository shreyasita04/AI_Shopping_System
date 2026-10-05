import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./Products.css";

function Products() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(response.data.products || response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <h2 className="status-message">Loading products...</h2>;
  }

  if (error) {
    return <h2 className="status-message">{error}</h2>;
  }

  return (
    <div className="products-page">
      <h1>Our Products</h1>

      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="product-image">
              {product.image ? (
<div className="product-image">
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
) : null}

<span
  style={{
    display: product.image ? "none" : "block",
  }}
>
  📦 No Image Available
</span>
            </div>

            <h2>
  <Link to={`/products/${product._id}`}>
    {product.name}
  </Link>
</h2>

            <p className="product-price">
              ₹{product.price}
            </p>

            <p className="product-description">
              {product.description}
            </p>

            <button 
            onClick={() => addToCart(product)}>
            Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;