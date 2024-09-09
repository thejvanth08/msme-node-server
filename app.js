const express = require("express");
const cors = require("cors");
require("express-async-errors");
require("dotenv").config();
const connectDB = require("./db/connect");
const authenticate = require("./middleware/authenticate");
const cookieParser = require("cookie-parser");

// routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const sensorRouter = require("./routes/sensor");
const port = process.env.PORT || 3000;
const app = express();

// middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Serve static files (optional, if needed)
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use("/sensor", sensorRouter);
app.use("/auth", authRouter);
app.use("/user", authenticate, userRouter);

async function start() {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("connected to DB");
    const server = app.listen(port, () => {
      console.log("server is listening at port", port);
    });
    server.keepAliveTimeout = 120 * 1000;
    server.headersTimeout = 120 * 1000;
  } catch (err) {
    console.log(err);
  }
}

start();
