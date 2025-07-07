import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Cart.css';
import { useNavigate } from 'react-router-dom';

// Inside the component


function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();



  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:3700/users/${user._id}/cart`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]); // fixed warning by including 'user' as dependency

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:3700/users/${user._id}/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    try {
      await axios.put(`http://localhost:3700/users/${user._id}/cart/${productId}`, {
        quantity
      });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map(item => (
              <li key={item.productId._id} className="cart-item">
                <img src={`/${item.productId.image}`} alt={item.productId.itemname} />
                <div>
                  <h4>{item.productId.itemname}</h4>
                  <p>Price: ₹{item.productId.price}</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId._id, parseInt(e.target.value))
                    }
                  />
                  <button onClick={() => handleRemove(item.productId._id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: ₹{calculateTotal()}</h3>
          <button onClick={() => navigate("/place-order")} className="checkout-btn">
  Proceed to Checkout
      </button>
        </>
      )}
    </div>
  );
}

export default Cart;
