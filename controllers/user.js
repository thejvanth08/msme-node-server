const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const getGpsCoordinates = require("../utilities/get-gps-coordinates");
const User = require("../models/User");

const detectDiseases = async (req, res) => {
  console.log("predicting-diseases");
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Prepare data to send to FastAPI
    const formData = new FormData();
    files.forEach((file) => {
      const filePath = path.join(__dirname, "..", "uploads", file.originalname);
      formData.append("files", fs.createReadStream(filePath), {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    });

    // Make a POST request to FastAPI
    const fastapiEndpoint = process.env.FASTAPI_URL;
    // console.log(fastapiEndpoint);
    const response = await axios.post(fastapiEndpoint, formData, {
      headers: formData.getHeaders(),
    });

    let detections = response.data.detections;
    // console.log(detections);

    // Use async/await to get GPS coordinates
    detections = await Promise.all(
      detections.map(async (detection) => {
        const filePath = path.join(
          __dirname,
          "..",
          "uploads",
          detection.filename,
        );
        console.log(filePath);
        const coordinates = await getGpsCoordinates(filePath);

        const cropImage = fs.readFileSync(filePath, {
          encoding: "base64",
        });

        return {
          ...detection,
          coordinates,
          cropImage,
        };
      }),
    );

    // Cleanup temp files (optional)
    // files.forEach((file) => {
    //   const filePath = path.join(__dirname, "..", "uploads", file.originalname);
    //   fs.unlinkSync(filePath);
    // });

    res.json(detections);
  } catch (error) {
    console.error("Error uploading files:", error.message);
    res
      .status(error.response?.status || 500)
      .json({ error: "Failed to upload files" });
  }
};

const verifyUser = (req, res) => {
  if (req.user) {
    // console.log(req.user);
    res.status(200).json({ status: "success", data: req.user });
  } else {
    res.status(400).json({ status: "failed" });
  }
};

const addUserDetails = async (req, res) => {
  const details = req.body;
  try {
    const foundUser = await User.findOne({ _id: req.user.id });

    if (!foundUser) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    foundUser.details = details;
    // console.log(foundUser);

    await foundUser.save(); // Save the document after modifying it
    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ status: "failed" });
  }
};

const getUserDetails = async (req, res) => {
  const userId = req.user.id;
  try {
    const {
      details: { overviewCrops, fields },
    } = await User.findOne({ _id: userId }).select("details");

    // console.log(overviewCrops, fields);
    res
      .status(200)
      .json({ status: "success", data: { overviewCrops, fields } });
  } catch (err) {
    res.status(400).json({ status: "failed" });
  }
};

module.exports = {
  verifyUser,
  detectDiseases,
  addUserDetails,
  getUserDetails,
};
