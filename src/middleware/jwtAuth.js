const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader;
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      next();
      return;
    } catch (error) {
      return res.status(403).send("Invalid token");
    }
  }
  return res.status(401).send("Unauthorized");
};

module.exports = authenticateToken;
