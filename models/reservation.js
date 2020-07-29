const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  id: {
    type: String,
  },
  customerName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
