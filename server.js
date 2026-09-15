require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Serve index.html
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// User Model
const User = mongoose.model("User", {
  name: String,
  email: String,
  phone: String
});

// Save User
app.post("/save", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("Saved");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});