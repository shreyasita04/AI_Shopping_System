import { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

 useEffect(() => {
  if (!userId) {
    setLoading(false);
    setError("Please login to view your orders.");
    return;
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/user/${userId}`
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [userId]);

  if (loading) {
    return <h2 className="status-message">Loading orders...</h2>;
  }

  if (error) {
    return <h2 className="status-message">{error}</h2>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h1>No Orders Yet</h1>
        <p>Your orders will appear here after you place an order.</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <div>
                <h2>Order #{order._id.slice(-6)}</h2>
                <p>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className="order-status">
                {order.orderStatus}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div className="order-item" key={index}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <span>Payment: {order.paymentStatus}</span>
              <strong>Total: ₹{order.totalAmount}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;