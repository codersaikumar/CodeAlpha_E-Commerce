const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: String,
  username: String,
  mobile: String,
  items: [
    {
      item: String,
      company: String,
      category: String,
      price: Number,
      quantity: Number
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  address: String,
  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model("Order", orderSchema);
