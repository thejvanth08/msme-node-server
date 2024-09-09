const express = require("express");
const upload = require("../middleware/upload");
const {
  detectDiseases,
  verifyUser,
  addUserDetails,
  getUserDetails,
} = require("../controllers/user");

const router = express.Router();

router.post("/verify", verifyUser);
router.post("/detect-diseases", upload.array("files"), detectDiseases);
router.post("/details", addUserDetails);
router.get("/details", getUserDetails);

module.exports = router;
