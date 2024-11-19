import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:3000/orders');
        setOrders(ordersResponse.data);

        // Fetch order details
        const details = await Promise.all(ordersResponse.data.map(async (order) => {
          const productResponse = await axios.get(`http://localhost:3000/products/${order.productId}`);
          return {
            orderId: order._id,
            productName: productResponse.data.title,
            productPrice: productResponse.data.price,
            productQuantity: order.quantity,
            productImage: productResponse.data.images[0],
            status: order.status,
          };
        }));
        setOrderDetails(details);

      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const cancelOrder = async (id) => {
    try {
      await axios.put(`http://localhost:3000/cancelOrder/${id}`);
      // Update order status in both orders and orderDetails
      setOrders(orders.map(order => (order._id === id ? { ...order, status: 'Cancelled' } : order)));
      setOrderDetails(orderDetails.map(detail => (detail.orderId === id ? { ...detail, status: 'Cancelled' } : detail)));
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const trackOrder = (id) => {
    alert(`Tracking order ${id}`);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orderDetails.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orderDetails.map(order => (
            <li key={order.orderId} className="order-item">
              <div className="order-details">
                <img src={order.productImage} alt={order.productName} className="product-image" />
                <div className="product-info">
                  <h3>{order.productName}</h3>
                  <p>Price: ${order.productPrice}</p>
                  <p>Quantity: {order.productQuantity}</p>
                  <p>Status: {order.status}</p>
                  {order.status === 'Processing' && (
                    <div className="button-group">
                      <button className="cancel-button" onClick={() => cancelOrder(order.orderId)}>Cancel Order</button>
                      <button className="track-button" onClick={() => trackOrder(order.orderId)}>Track Order</button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
