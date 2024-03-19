const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    jwt.verify(req.body.token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).send("Something went wrong. Please try again.");
  }
  next();
};

module.exports = authenticateToken;
