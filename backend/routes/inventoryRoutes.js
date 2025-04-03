const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const Product = require("../models/Inventory"); 
const User = require("../models/User"); 


router.post("/addProduct", async (req, res) => {
  try {
    const { product, price, qty, createdBy } = req.body;

    // Validate user exists
    const userExists = await User.findById(createdBy);
    if (!userExists) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const newProduct = new Product({ product, price, qty, createdBy });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", data: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get("/getProduct/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("createdBy", "name email");
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put("/updateProduct/:id", async (req, res) => {
  const { id } = req.params;
  const { product, price, qty } = req.body;

  try {

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product) existingProduct.product = product;
    if (price) existingProduct.price = price;
    if (qty) existingProduct.qty = qty;

    await existingProduct.save();

    res.status(200).json({ message: "Product updated successfully", data: existingProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteProduct/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
