const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
  },
  parameters: Object,
  timestamp: {
    type: String,
    required: true,
  },
});

const SensorData = mongoose.model("SensorData", sensorDataSchema);

module.exports = SensorData;
