import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminOrders.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    email: '',
    date: '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:3700/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3700/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(`Error updating status:`, err);
    }
  };

  // Utility to get date in YYYY-MM-DD format
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0]; // Removes time
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filters.status ? order.status === filters.status : true;
    const matchesEmail = filters.email
      ? order.email.toLowerCase().includes(filters.email.toLowerCase())
      : true;
    const matchesDate = filters.date
      ? formatDate(order.date) === filters.date
      : true;

    return matchesStatus && matchesEmail && matchesDate;
  });

  return (
    <div className="all-orders-container">
      <h2>All Orders (Admin Panel)</h2>

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
          placeholder="Search by Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Date</th>
              <th>Status</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="10">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.username}</td>
                  <td>{order.email}</td>
                  <td>{order.mobile}</td>
                  <td>{formatDate(order.date)}</td>
                  <td>{order.status}</td>
                  <td>{order.address}</td>
                  <td>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.item} ({item.quantity}) - ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}</td>
                  <td>
                    {order.status === 'Pending' ? (
                      <>
                        <button
                          className="confirm-btn"
                          onClick={() => handleUpdateStatus(order._id, 'Confirmed')}
                        >
                          Confirm
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <em>{order.status}</em>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
