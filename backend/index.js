require("dotenv").config();  // Load environment variables at the top

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/mern", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);  // Exit process with failure
    }
};

connectDB();

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const inventoryRoutes = require("./routes/inventoryRoutes");
app.use("/api/inventory", inventoryRoutes);


app.get("/", (req, res) => {
    res.send("Hello, MERN Stack!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
