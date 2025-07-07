const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3700;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/ECommerceWebsite")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  mobile: Number,
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ]
});

const userModel = mongoose.model("user", userSchema);


// Routes

// Create user (signup)
app.post("/signup", async (req, res) => {
  try {
    const data = new userModel(req.body);
    await data.save();
    res.status(201).send("User Registered");
  } catch (err) {
    res.status(500).send("Error registering user");
  }
});

// Login (basic example)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email, password });
    if (user) {
      res.send({ message: "Login successful", user });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all users (for admin)

app.get('/allusers', async (req, res) => {
  try {
    const users = await userModel.find({}, '-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});


// Add product to user's cart
app.post('/users/:userId/cart', async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found");

    const existingIndex = user.cart.findIndex(item => item.productId.equals(productId));
    if (existingIndex !== -1) {
      user.cart[existingIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.send(user.cart);
  } catch (err) {
    res.status(500).send("Error adding to cart");
  }
});

// Get user's cart (with populated product info)
app.get('/users/:userId/cart', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId).populate('cart.productId');
    if (!user) return res.status(404).send("User not found");

    res.send(user.cart);
  } catch (err) {
    res.status(500).send("Error fetching cart");
  }
});

// Remove product from user's cart
app.delete('/users/:userId/cart/:productId', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found");

    user.cart = user.cart.filter(item => !item.productId.equals(req.params.productId));
    await user.save();

    res.send(user.cart);
  } catch (err) {
    res.status(500).send("Error removing from cart");
  }
});

// Update quantity of a cart item
app.put('/users/:userId/cart/:productId', async (req, res) => {
  const { quantity } = req.body;
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found");

    const itemIndex = user.cart.findIndex(item => item.productId.equals(req.params.productId));
    if (itemIndex === -1) return res.status(404).send("Product not found in cart");

    user.cart[itemIndex].quantity = quantity;
    await user.save();

    res.send(user.cart);
  } catch (err) {
    res.status(500).send("Error updating cart");
  }
});

const Product = require('./models/Product'); // ✅ correct place

// Now you can use Product in your product-related routes

// Create Product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send("Error creating product");
  }
});

// Get All Products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    res.status(500).send("Error fetching products");
  }
});

// Update Product
app.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updated);
  } catch (err) {
    res.status(500).send("Error updating product");
  }
});

// Delete Product
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({ message: "Product deleted" });
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});


const Order = require('./models/Order');



app.post('/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).send({ message: "Order placed successfully!" });
  } catch (err) {
    res.status(500).send({ error: "Failed to place order" });
  }
});

// GET /orders/user/:userId
// ✅ Better route to fetch orders by email
app.get('/orders/user/email/:email', async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Cancel Order by ID
app.put('/orders/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    if (order.status !== 'Pending') {
      return res.status(400).send("Only pending orders can be cancelled");
    }

    order.status = 'Cancelled';
    await order.save();
    res.send({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).send("Error cancelling order");
  }
});

// PUT /orders/:id/status
// PUT /orders/:id/status
app.put('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// In routes/orders.js or equivalent
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find(); // Or .find({}) 
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});



// Other product routes (create, read, update, delete) as you have

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
