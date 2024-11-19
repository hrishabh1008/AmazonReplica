import React, { useEffect, useState } from 'react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('https://isells-server.vercel.app/orders', { credentials: 'include' });
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Order History</h2>
            {orders.length === 0 ? <p>No orders found</p> : (
                <ul>
                    {orders.map(order => (
                        <li key={order._id}>
                            <h3>Order ID: {order._id}</h3>
                            <p>Status: {order.status}</p>
                            <p>Shipping Address: {order.shippingAddress}</p>
                            <p>Payment Method: {order.paymentMethod}</p>
                            <ul>
                                <li>
                                    <p>Product: {order.productId.name}</p>
                                    <p>Quantity: {order.quantity}</p>
                                    <p>Price: {order.price}</p>
                                </li>
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;
