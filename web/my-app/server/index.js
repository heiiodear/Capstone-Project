const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require('./models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AlertModel = require("./models/alert");

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
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
  const { username, tel, discord, email, password, address } = req.body;

  try {
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email has already been registerd" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, tel, discord, email, password: hashedPassword, address });

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

app.get("/alerts", async (req, res) => {
    try {
      const alerts = await AlertModel.find({}).sort({ timestamp: -1 });
      res.json(alerts);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
});

app.get("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; 
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = jwt.verify(token, "your-secret-key"); 
        const user = await UserModel.findById(decoded.id); 

        if (!user) return res.status(404).json({ error: "User not found" });

        const { password, ...userData } = user.toObject();
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

app.put("/profile/image", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, "your-secret-key");
    const userId = decoded.id;

    const { profileImage } = req.body;
    if (!profileImage) {
      return res.status(400).json({ error: "No image URL provided" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    const { password, ...userData } = updatedUser.toObject();
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: "Failed to update profile image" });
  }
});

app.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, "your-secret-key"); 
    const userId = decoded.id;

    const { username, email, discord, tel, address, profileImage } = req.body;

    const updates = {};

    
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (discord) updates.discord = discord;
    if (tel) updates.tel = tel;
    if (address) updates.address = address;
    if (profileImage) updates.profileImage = profileImage;

 
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },  
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    const { password: _, ...userData } = updatedUser.toObject();
    res.status(200).json(userData);

  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Failed to update user data" });
  }
});

app.delete("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, "your-secret-key");
    const userId = decoded.id;

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


app.listen(5000, () => {
  console.log("server is running");
});
