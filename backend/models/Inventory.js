const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    product: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
