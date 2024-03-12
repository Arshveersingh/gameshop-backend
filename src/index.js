const express = require("express");
const path = require("path");
require("dotenv").config({
  path: path.resolve(process.cwd(), "config", ".env"),
});

app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
