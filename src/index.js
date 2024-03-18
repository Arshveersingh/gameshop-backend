const express = require("express");
const userRouter = require("./routes/user");
const cors = require("cors");

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

const PORT = process.env.PORT || 3000;

app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}, URL: http://localhost:${PORT}`);
});
