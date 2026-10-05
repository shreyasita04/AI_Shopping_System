import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import axios from "axios";
import "./Checkout.css";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderMessage, setOrderMessage] = useState(""); 
  const [orderPlaced, setOrderPlaced] = useState(false);
  const handlePlaceOrder = async () => {
  if (!shippingAddress || !paymentMethod) {
    setOrderMessage("Please enter your address and select a payment method.");
    return;
  }

  try {
const response = await axios.post(
  "http://localhost:5000/api/orders",
  {
    userId,
    items: cartItems,
    shippingAddress,
    paymentMethod,
  }
);
const orderId = response.data.order._id;

const paymentResponse = await axios.post(
  "http://localhost:5000/api/payments",
  {
    user: userId,
    order: orderId,
    amount: cartTotal,
    paymentMethod,
  }
);

clearCart();

setOrderPlaced(true);
setOrderMessage("Order placed successfully!");
} catch (error) {

  setOrderMessage(
    error.response?.data?.message || "Failed to place order."
  );
}
};
if (orderPlaced) {
  return (
    <div className="checkout-empty">
      <h1>🎉 Order Placed Successfully!</h1>

      <p>Thank you for your order.</p>

      <p>Your payment has been recorded successfully.</p>

      <Link to="/orders" className="shop-button">
        View My Orders
      </Link>

      <Link to="/products" className="shop-button">
        Continue Shopping
      </Link>
    </div>
  );
}

if (cartItems.length === 0) {
  return (
    <div className="checkout-empty">
      <h1>Your Cart is Empty</h1>
      <p>Please add products before checking out.</p>

      <Link to="/products" className="shop-button">
        Continue Shopping
      </Link>
    </div>
  );
}

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <div className="checkout-products">
          <h2>Your Order</h2>

          {cartItems.map((item) => (
            <div className="checkout-item" key={item._id}>
              <div>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
              </div>

              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}

          <div className="checkout-total">
            <span>Total Amount</span>
            <strong>₹{cartTotal}</strong>
          </div>
        </div>

        <div className="checkout-form">
          <h2>Delivery Details</h2>

          <input
            type="text"
            placeholder="Full Name"
          />

          <input
            type="text"
            placeholder="Phone Number"
          />

          <textarea
  placeholder="Delivery Address"
  rows="4"
  value={shippingAddress}
  onChange={(e) => setShippingAddress(e.target.value)}
></textarea>

<select
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
>
  <option value="">Select Payment Method</option>
  <option value="cod">Cash on Delivery</option>
  <option value="upi">UPI</option>
  <option value="card">Card</option>
</select>

          <button className="place-order-button"
  onClick={handlePlaceOrder}>
  Place Order
          </button>
          {orderMessage && <p>{orderMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default Checkout;