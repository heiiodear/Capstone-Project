const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  tel: { type: String, required: true },
  discord: { type: String, required: false, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    plot: { type: String },
    road: { type: String },
    district: { type: String },
    province: { type: String },
    postal: { type: String },
  },
  profileImage: {
  type: String,
  default: "https://www.engineering.columbia.edu/sites/default/files/styles/full_size_1_1/public/2024-07/Columbia_Engineering_Headshot_1_B.png?itok=n6_TL_JQ"
}

});

const UserModel = mongoose.model('User', userSchema, 'users'); 
module.exports = UserModel;
