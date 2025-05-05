const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require('./models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type'] 
  }));
  
mongoose.connect("mongodb+srv://amytr1234:ueV0LjDO8mK9NQR5@capstoneproject.tekjtkq.mongodb.net/Capstone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed", err);
    process.exit(1); 
  });

app.post("/register", async (req, res) => {
  const { username, tel, discord, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, tel, discord, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Incorrect password" });
      }
  
      const token = jwt.sign({ id: user._id, email: user.email }, "your-secret-key", {
        expiresIn: "1h",
      });
  
      res.status(200).json({ message: "Login successful", token });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Login failed" });
    }
  });

app.listen(5000, () => {
  console.log("server is running");
});
