const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  try {
    const cookie = req?.cookies;
    const token = cookie?.token;
    const { id, email } = jwt.verify(token, jwtSecret);
    req.user = { id, email };
    next();
  } catch (err) {
    res.status(401).json({ status: "failed" });
  }
};

module.exports = authenticate;
