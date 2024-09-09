const SensorData = require("../models/SensorData");

const storeSensorData = async (req, res) => {
  const sensorData = req.body;
  console.log(sensorData);
  try {
    const result = await SensorData.create(sensorData);
    console.log("stored on db");
  } catch (err) {
    res.status(500).json({ status: "failed" });
  }
};

module.exports = {
  storeSensorData,
};
