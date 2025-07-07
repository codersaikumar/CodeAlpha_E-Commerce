const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  itemname: String,
  company: String,
  category: String,
  price: Number,
  stock: Number,
  image: String
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
