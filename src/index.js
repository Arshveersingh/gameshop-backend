const express = require("express");
const router = require("./routes/routes");

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
