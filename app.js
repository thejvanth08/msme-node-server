const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ msg: "success" });
});

app.post("/data", (req, res) => {
  const data = req.body;
  console.log(data);
  res.json({ msg: data });
});

const server = app.listen(port, () => {
  console.log(`server is running at port ${port}...`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;