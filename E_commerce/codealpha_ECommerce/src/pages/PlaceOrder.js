import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/PlaceOrder.css';
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    
    const fetchCart = async () => {
      const res = await axios.get(`http://localhost:3700/users/${user._id}/cart`);
      setCartItems(res.data);
    };
    if (user) fetchCart();
  }, [user]);

    const navigate=useNavigate();
  const handleSubmit = async () => {
    const orderData = {
      email: user.email,
      username: user.username,
      mobile: user.mobile,
      items: cartItems.map(item => ({
        item: item.productId.itemname,
        company: item.productId.company,
        category: item.productId.category,
        price: item.productId.price,
        quantity: item.quantity
      })),
      address
    };

    try {
      const res = await axios.post('http://localhost:3700/orders', orderData);
      alert("Order placed successfully!");
      navigate('/orders')
    } catch (err) {
      console.error("Error placing order", err);
    }
  };

  return (
    <div className="order-page">
      <h2>Place Your Order</h2>
      <p><strong>Name:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Mobile:</strong> {user.mobile}</p>

      <h3>Items:</h3>
      <ul>
        {cartItems.map(item => (
          <li key={item.productId._id}>
            {item.productId.itemname} | Company: {item.productId.company} | Category: {item.productId.category} | ₹{item.productId.price} × {item.quantity}
          </li>
        ))}
      </ul>

      <label>
        <strong>Address:</strong><br />
        <textarea rows="4" value={address} onChange={e => setAddress(e.target.value)} />
      </label><br />

      <button onClick={handleSubmit}>Submit Order</button>
    </div>
  );
}

export default PlaceOrder;
