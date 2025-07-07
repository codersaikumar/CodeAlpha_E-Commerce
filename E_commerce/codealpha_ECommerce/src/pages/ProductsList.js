
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/ProductsList.css';

function ProductList() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    itemname: '',
    company: '',
    category: ''
  });

  useEffect(() => {
    axios.get("http://localhost:3700/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Please login to add items to cart.");
      return;
    }

    try {
      await axios.post(`http://localhost:3700/users/${user._id}/cart`, {
        productId,
        quantity: 1
      });
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    }
  };

  const filteredProducts = products.filter(prod =>
    prod.itemname.toLowerCase().includes(filters.itemname.toLowerCase()) &&
    prod.company.toLowerCase().includes(filters.company.toLowerCase()) &&
    prod.category.toLowerCase().includes(filters.category.toLowerCase())
  );

  return (
    <div className="user-container">
      <h2>All Products</h2>

      <div className="filters">
        <input name="itemname" value={filters.itemname} onChange={handleFilterChange} placeholder="Item name" />
        <input name="company" value={filters.company} onChange={handleFilterChange} placeholder="Company" />
        <input name="category" value={filters.category} onChange={handleFilterChange} placeholder="Category" />
      </div>

      <div className="product-list">
        {filteredProducts.map(prod => (
          <div key={prod._id} className="product-card">
            <img src={`/${prod.image}`} alt={prod.itemname} />
            <h3>{prod.itemname}</h3>
            <p>Company: {prod.company}</p>
            <p>Category: {prod.category}</p>
            <p>Price: ₹{prod.price}</p>
            <p>Stock: {prod.stock}</p>
            <button onClick={() => handleAddToCart(prod._id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
