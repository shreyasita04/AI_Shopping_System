import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/products`
        );

        const productList = response.data.products || response.data;

        setProducts(productList.slice(0, 3));
      } catch (error) {
        console.error("Failed to load featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to AI Shopping</h1>

          <p>
            Discover great products and enjoy a simple and convenient
            shopping experience.
          </p>

          <Link to="/products" className="shop-now-button">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products-section">
        <h2>Featured Products</h2>

        <div className="featured-products-grid">
          {products.map((product) => (
            <div className="featured-product-card" key={product._id}>
              <div className="featured-product-image">
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

              <h3>{product.name}</h3>

              <p className="featured-product-price">
                ₹{product.price}
              </p>

              <Link
                to={`/products/${product._id}`}
                className="view-product-button"
              >
                View Product
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="featured-section">
        <h2>Why Shop With Us?</h2>

        <div className="features">
          <div className="feature-card">
            <h3>🛍️ Wide Selection</h3>
            <p>Explore a variety of products in one place.</p>
          </div>

          <div className="feature-card">
            <h3>🔒 Secure Shopping</h3>
            <p>
              Your shopping experience is designed with security in mind.
            </p>
          </div>

          <div className="feature-card">
            <h3>🚚 Easy Orders</h3>
            <p>
              Add products to your cart and place orders easily.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;