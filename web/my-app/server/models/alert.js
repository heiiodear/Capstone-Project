const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  user_id: String,
  name: String,
  image_url: String,
  video_url: String,
  note: String,
  timestamp: String,
  resolved: {
    type: Boolean,
    default: false,
  },
  note: { type: String, 
    default: "" 
  },
});

const AlertModel = mongoose.model("fall", alertSchema, "fall");
module.exports = AlertModel;
