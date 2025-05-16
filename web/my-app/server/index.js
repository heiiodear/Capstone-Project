const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require('./models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AlertModel = require("./models/alert");
const axios = require("axios");
const FormData = require('form-data');
const nodemailer = require("nodemailer");
const Camera = require('./models/camera');

const app = express();
app.use(express.json());
require('dotenv').config(); 
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
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
  const { username, tel, discord= "", email, password, address } = req.body;

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
  
      res.status(200).json({ message: "Login successful", token, user: { _id: user._id } });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Login failed" });
    }
  });

app.post("/alert", async (req, res) => {
  const { user_id, image_url, video_url, emailEnabled, discordEnabled } = req.body;

  if (!user_id || !image_url || !video_url) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // 🔄 Save updated preferences to the database
    await UserModel.findByIdAndUpdate(user_id, {
      $set: {
        "notificationSettings.email": emailEnabled,
        "notificationSettings.discord": discordEnabled
      }
    });

    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { email, discord, username, notificationSettings } = user;
    
    const alertMessage = `🚨 Urgent Alert from Secura.com: Fall Detected!

Secura.com's surveillance system has detected a fall incident involving a user.

An image and video of the event have been recorded to help you assess the situation and take immediate action.

Please check on the user's condition urgently to prevent any serious consequences.

Thank you for trusting our automated safety alert system.

— The Secura.com Team —`;
    if (notificationSettings?.discord && discord) {
      try {
        const webhookURL = discord;
        const videoStream = await axios.get(video_url, { responseType: "stream" });
        const form = new FormData();

        form.append("payload_json", JSON.stringify({
          content: alertMessage,
          embeds: [
            {
              image: { url: image_url },
              color: 15158332
            }
          ]
        }));

        form.append("file", videoStream.data, {
          filename: "fall_video.mp4",
          contentType: "video/mp4"
        });

        await axios.post(webhookURL, form, {
          headers: form.getHeaders()
        });

        console.log("✅ Discord alert sent successfully:", username);
      } catch (err) {
        console.error("❌ Discord alert failed to send:", err.message);
      }
    }

    if (notificationSettings?.email && email) {
      try {
        console.log("📨 Preparing to send email...");
        console.log("📤 To:", email);
        console.log("📤 Enabled:", notificationSettings.email);

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: `\"Secura\" <${process.env.EMAIL_SENDER}>`,
          to: email,
          subject: "🚨 Urgent Alert from Secura.com: Fall Detected!",
          text: alertMessage,
          html: `<p><strong>🚨 Urgent Alert from Secura.com: Fall Detected!</strong></p>
                 <p>Secura.com's surveillance system has detected a fall incident involving a user.</p>
                 <p>An image and video of the event have been recorded to help you assess the situation and take immediate action.</p>
                 <p>Please check on the user's condition urgently to prevent any serious consequences.</p>
                 <a href="${video_url}" target="_blank" style="display:inline-block;text-decoration:none;">
                  <img src="${image_url}" width="400" style="display:block;border:0;" alt="Fall snapshot" />
                  <p style="color:blue; font-weight:bold;">▶ Click to view full video</p>
                </a>
                <p>Thank you for trusting our automated safety alert system.</p>
                <p><em>— The Secura.com Team —</em></p>`
        };

        console.log("📧 Sending email...");

        await transporter.sendMail(mailOptions)
          .then(info => console.log("✅ Email alert sent:", info.response))
          .catch(err => console.error("❌ Email alert failed:", err));

      } catch (err) {
        console.error("❌ Email alert outer error:", err.message);
      }
    }

    res.status(200).json({ message: "Alert sent successfully and preferences saved." });

  } catch (error) {
    console.error("Alert failed to send:", error.message);
    res.status(500).json({ error: "Alert failed to send." });
  }
});

app.put("/notification-settings", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, "your-secret-key");
    const userId = decoded.id;

    const { emailEnabled, discordEnabled } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        notificationSettings: {
          email: emailEnabled,
          discord: discordEnabled,
        },
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Notification settings updated." });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    res.status(500).json({ error: "Failed to update notification settings" });
  }
});

app.get("/alerts", async (req, res) => {
  const { userId } = req.query;
  const query = userId ? { user_id: userId } : {};

  try {
    const alerts = await AlertModel.find(query).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

app.patch("/alerts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved, note } = req.body;

    const updateFields = {};
    if (resolved !== undefined) updateFields.resolved = resolved;
    if (note !== undefined) updateFields.note = note;

    const updatedAlert = await AlertModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedAlert) return res.status(404).json({ error: "Alert not found" });

    res.json(updatedAlert);
  } catch (err) {
    console.error("Error updating alert:", err);
    res.status(500).json({ error: "Failed to update alert" });
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
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const cameras = await Camera.find({ user_id });
    const unresolvedAlerts = await AlertModel.find({ user_id, resolved: false });

       
    console.log("Cameras:", cameras);
    console.log("Unresolved Alerts:", unresolvedAlerts);

    const roomStatuses = {};

    cameras.forEach(camera => {
      const roomName = camera.name;
      const hasAlert = unresolvedAlerts.some(alert => alert.name === roomName);
      roomStatuses[roomName] = hasAlert ? "alert" : "safe";
    });

    // Count safe and unsafe rooms
    const activeAlerts = Object.values(roomStatuses).filter(status => status === "alert").length;
    const safeRooms = Object.values(roomStatuses).filter(status => status === "safe").length;

    res.json({
      activeAlerts,
      safeRooms,
      roomStatuses
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Server error while fetching dashboard" });
  }
});


app.post("/api/send-verification-code", async (req, res) => {
    const { email } = req.body;


    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }
    
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).send({ message: "Email not found" });
    }
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    try {
        
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
             from: `"Secura" <${process.env.EMAIL_SENDER}>`, 
            to: email, 
            subject: "Your Verification Code",
            text: `Your verification code is: ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);


        res.status(200).send({
            message: "Verification code sent successfully",
            code: verificationCode, 
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send({ message: "Failed to send verification code" });
    }
});

app.post("/api/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).send({ message: "Email and new password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.findOneAndUpdate({ email }, { password: hashedPassword });
        res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error updating password" });
    }
});

app.get('/cameras', async (req, res) => {
    const userId = req.query.userId;  
    if (!userId) {
        return res.status(400).json({ error: "Missing userId in query parameters." });
    }

    const cameras = await Camera.find({ userId });
    res.json(cameras);
});



app.post('/cameras', async (req, res) => {
    const { userId, name, src, isActive } = req.body;
    console.log(req.body); 
    if (!userId) {
        return res.status(400).json({ error: "Missing userId in request body." });
    }

    const camera = new Camera({ userId, name, src, isActive });
    try {
        await camera.save();
        res.status(201).json(camera);  
    } catch (error) {
        console.error('Error saving camera:', error);
        res.status(500).json({ error: "Error saving camera" });
    }
});


app.put('/cameras/:id', async (req, res) => {
    try {
        const camera = await Camera.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!camera) return res.status(404).json({ error: "Camera not found." });
        res.json(camera);
    } catch (error) {
        res.status(500).json({ error: "Error updating camera." });
    }
});


app.delete('/cameras/:id', async (req, res) => {
    try {
        const deleted = await Camera.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Camera not found." });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error deleting camera." });
    }
});



app.listen(5000, () => {
  console.log("server is running");
});
