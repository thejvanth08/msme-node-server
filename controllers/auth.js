const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SECRET;

const signup = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const result = await User.create({ email: email, password: newPassword });

    const payload = {
      id: result._id,
      email: email,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "10d",
    });

    // console.log(token);
    res.cookie("token", token);
    res
      .status(201)
      .json({ status: "success", data: { userId: result._id, email: email } });
  } catch (err) {
    console.log(err);
    res.status(401).json({ status: "failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      res.status(404).json({ status: "failed" });
    }
    if (foundUser.password == password) {
      const payload = {
        id: foundUser._id,
        email: email,
      };

      const token = await jwt.sign(payload, jwtSecret, {
        expiresIn: "10d",
      });

      res.cookie("token", token);
      res.status(201).json({
        status: "success",
        data: { userId: foundUser._id, email: email },
      });
    } else {
      res.status(401).json({ status: "failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ status: "failed" });
  }
};

module.exports = {
  signup,
  login,
};
