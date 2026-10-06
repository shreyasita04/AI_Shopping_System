import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./AIAssistant.css";
const API_URL = import.meta.env.VITE_API_URL;

function AIAssistant() {
  const { addToCart } = useCart();

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setResponse("");
    setRecommendedProducts([]);

    try {
      const result = await axios.post(
        `${API_URL}/api/ai/chat`,
        {
          message: message,
        }
      );

      setResponse(result.data.message);
      setRecommendedProducts(result.data.products || []);
    } catch (error) {
      console.error("AI request error:", error);

      setResponse(
        "Sorry, I couldn't connect to the AI assistant. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant-page">
      <div className="ai-assistant-card">
        <div className="ai-assistant-header">
          <h1>🤖 AI Shopping Assistant</h1>
          <p>
            Tell me what you're looking for and I'll help you find the
            right product.
          </p>
        </div>

        <form onSubmit={handleAskAI} className="ai-chat-form">
          <textarea
            placeholder="Example: I need headphones under ₹2000"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </form>

        {response && (
          <div className="ai-response">
            <h2>🤖 AI Recommendation</h2>

            <p>{response}</p>

            {recommendedProducts.length > 0 && (
              <div className="ai-products">
                {recommendedProducts.map((product) => (
                  <div className="ai-product-card" key={product._id}>
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

                    <div className="ai-product-info">
                      <h3>{product.name}</h3>

                      <p className="ai-product-price">
                        ₹{product.price}
                      </p>

                      <div className="ai-product-buttons">
                        <Link
                          to={`/products/${product._id}`}
                          className="view-product-button"
                        >
                          View Product
                        </Link>

                        <button
                          className="ai-add-cart-button"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIAssistant;