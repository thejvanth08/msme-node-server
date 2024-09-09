const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
  },
  cropName: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  details: {
    overviewCrops: [String],
    fields: [Object],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
