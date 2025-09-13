import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:8000/api/orders.php', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3>Order #{order.id}</h3>
              <span style={{
                padding: '5px 10px',
                borderRadius: '4px',
                color: 'white',
                backgroundColor: order.status === 'completed' ? '#28a745' : order.status === 'shipping' ? '#ffc107' : '#007bff'
              }}>
                {order.status}
              </span>
            </div>
            <p>Created: {new Date(order.created_at).toLocaleDateString()}</p>
            <p>Total: ${order.total}</p>
            {order.items && order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderTop: '1px solid #eee' }}>
                <span>{item.name} x {item.quantity}</span>
                <span>${item.price}</span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrders;
