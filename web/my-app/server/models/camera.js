const mongoose = require('mongoose');

const CameraSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    src: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}); 

module.exports = mongoose.model('Camera', CameraSchema);
