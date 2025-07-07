import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminProducts.css';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemname: "", company: "", category: "", price: "", stock: "", image: ""
  });
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    itemname: '',
    company: '',
    category: ''
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3700/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    if (editId) {
      await axios.put(`http://localhost:3700/products/${editId}`, form);
    } else {
      await axios.post("http://localhost:3700/products", form);
    }
    setForm({ itemname: "", company: "", category: "", price: "", stock: "", image: "" });
    setEditId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3700/products/${id}`);
    fetchProducts();
  };

  // Filtered list
  const filteredProducts = products.filter((prod) =>
    prod.itemname.toLowerCase().includes(filters.itemname.toLowerCase()) &&
    prod.company.toLowerCase().includes(filters.company.toLowerCase()) &&
    prod.category.toLowerCase().includes(filters.category.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h2>Manage Products</h2>

      <div className="form">
        {["itemname", "company", "category", "price", "stock", "image"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
          />
        ))}
        <button onClick={handleAddOrUpdate}>
          {editId ? "Update" : "Add"} Product
        </button>
        <button onClick={()=>navigate('/admin')}>
               Back
        </button>
      </div>

      {/* Filter Section */}
      <div className="filter-box">
        <h4>Filter Products</h4>
        <input
          type="text"
          placeholder="Filter by item name"
          value={filters.itemname}
          onChange={(e) => setFilters({ ...filters, itemname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by company"
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
      </div>

      <div className="product-list">
        {filteredProducts.map((prod) => (
          <div key={prod._id} className="product-card">
            <img src={`/${prod.image}`} alt={prod.itemname} />
            <h3>{prod.itemname}</h3>
            <p>{prod.company}</p>
            <p>₹{prod.price} | Stock: {prod.stock}</p>
            <button onClick={() => handleEdit(prod)}>Edit</button>
            <button onClick={() => handleDelete(prod._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;
