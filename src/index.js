const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({
  path: path.resolve(process.cwd(), "config", ".env"),
});
const userRouter = require("./routes/user");
const gamesRouter = require("./routes/games");

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

const PORT = process.env.PORT || 3000;

app.use("/", gamesRouter);
app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}, URL: http://localhost:${PORT}`);
});
