const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require('./models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AlertModel = require("./models/alert");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
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
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email has already been registerd" });
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

// Update Alert
app.post("/alert", async (req, res) => {
    const { user_id, image_url, video_url } = req.body;
  
    if (!user_id || !image_url || !video_url) {
      return res.status(400).json({ error: "Missing required fields." });
    }
  
    try {
      const user = await UserModel.findOne({ user_id: user_id });
  
      if (!user || !user.discord) {
        return res.status(404).json({ error: "User or webhook not found." });
      }
  
      const webhookURL = user.discord;
  
      await axios.post(webhookURL, {
        content: "🚨 **พบเหตุการณ์ล้ม!**",
        embeds: [
          {
            title: "🎥 ดูคลิป",
            description: `[คลิกที่นี่เพื่อดูวิดีโอ](${video_url})`,
            image: { url: image_url },
            color: 15158332
          }
        ]
      });
  
      console.log("✅ แจ้งเตือนสำเร็จ:", user.username || user_id);
      res.status(200).json({ message: "แจ้งเตือนสำเร็จ" });
  
    } catch (error) {
      console.error("❌ แจ้งเตือนล้มเหลว:", error);
      res.status(500).json({ error: "แจ้งเตือนล้มเหลว" });
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

app.patch("/alerts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAlert = await AlertModel.findByIdAndUpdate(
      id,
      { resolved: true },
      { new: true }
    );
    if (!updatedAlert) return res.status(404).json({ error: "Alert not found" });
    res.json(updatedAlert);
  } catch (err) {
    console.error("Error resolving alert:", err);
    res.status(500).json({ error: "Failed to resolve alert" });
  }
});

app.get("/dashboard", async (req, res) => {
  try {
    const alerts = await AlertModel.find({});

    const activeAlerts = alerts.filter(alert => !alert.resolved).length;
    const safeRooms = alerts.filter(alert => alert.resolved).length;

    const roomStatuses = {};

    alerts.forEach((alert) => {
      const room = alert.room || "Unknown";
      const status = alert.resolved ? "safe" : "alert";
      roomStatuses[room] = status; //รอกล้อง
    });

    res.json({
      activeAlerts,
      safeRooms,
      roomStatuses,
    });
  } catch (err) {
    console.error("Error generating dashboard:", err);
    res.status(500).json({ error: "Failed to generate dashboard" });
  }
});

app.listen(5000, () => {
  console.log("server is running");
});
