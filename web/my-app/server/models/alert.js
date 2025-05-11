const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  user_id: String,
  image_url: String,
  video_url: String,
  note: String,
  timestamp: String,
  resolved: {
    type: Boolean,
    default: false,
  },
});

const AlertModel = mongoose.model("fall", alertSchema, "fall");
module.exports = AlertModel;
