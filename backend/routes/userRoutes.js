const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,  // Add this
});



const User = mongoose.model("users", UserSchema);

// Route to add a user (POST)
router.post("/addUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({ name, email, password:hashedPassword });  // Store plain password (Not recommended for production)
    await newUser.save();

    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// **Route to get all users (GET)**
router.get("/getUsers/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const users = await User.findById(id);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params; // Extract ID from params
  const { name, email } = req.body; // Extract fields from body

  try {
    // Find user by ID
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields only if they exist in req.body
    if (name) user.name = name;
    if (email) user.email = email;

    // Save the updated user
    await user.save();

    // Send success response
    res.status(200).json({ message: "User updated successfully", data: user });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




//-------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------------------------------

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password); // Await the result

      if (isMatch) {
        res.json({ message: "Login Successful" });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the router
module.exports = router;
