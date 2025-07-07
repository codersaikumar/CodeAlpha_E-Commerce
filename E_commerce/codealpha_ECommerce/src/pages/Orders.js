import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';

import '../styles/orders.css';


function Orders() {
 
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const [filters, setFilters] = useState({
    status: '',
    itemName: '',
    date: '',
  });

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filters.status ? order.status === filters.status : true;
    const matchesItem = filters.itemName
      ? order.items.some(item => item.item.toLowerCase().includes(filters.itemName.toLowerCase()))
      : true;
    const matchesDate = filters.date
      ? new Date(order.date).toDateString() === new Date(filters.date).toDateString()
      : true;
  
    return matchesStatus && matchesItem && matchesDate;
  });
  
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3700/orders/user/email/${user.email}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    try {
      await axios.put(`http://localhost:3700/orders/${orderId}/cancel`);
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: 'Cancelled' } : order));
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  return (
    
    <div className="orders-container">
      <div className="filters">
  <select
    value={filters.status}
    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
  >
    <option value="">All Statuses</option>
    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Cancelled">Cancelled</option>
  </select>

  <input
    type="text"
    placeholder="Search by Item Name"
    value={filters.itemName}
    onChange={(e) => setFilters({ ...filters, itemName: e.target.value })}
  />

  <input
    type="date"
    value={filters.date}
    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
  />
</div>

      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.map((order, index) => (
          <div key={index} className="order-card">
            <p><strong>Order Date:</strong> {order.date}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <h4>Items:</h4>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.item} | Company: {item.company} | Category: {item.category} | ₹{item.price} × {item.quantity}
                </li>
              ))}
            </ul>
            {order.status === 'Pending' && (
              <button className="cancel-btn" onClick={() => handleCancel(order._id)}>
                Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}


export default Orders;

