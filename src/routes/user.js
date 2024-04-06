const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const validateUserData = require("../middleware/validation");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/jwtAuth");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/dashboard", authenticateToken, (req, res) => {
  console.log("Authenticated");
  res.status(200).send("Authenticated");
});
router.post("/signup", validateUserData, async (req, res) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser === null) {
    const existingUsername = await prisma.user.findUnique({
      where: { username: req.body.username },
    });
    if (existingUsername !== null) {
      return res.status(409).json({
        username: {
          message: "Username already exists in database.",
        },
      });
    }

    try {
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          username: req.body.username,
          password: getHashedPassword(req.body.password),
        },
      });
      if (user) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        return res.status(201).send({
          token: token,
        });
      }
    } catch (error) {
      return res.status(500).json({ errors: "Unexpected error." });
    }
  }
  return res.status(409).json({
    email: {
      message: "Invalid email format or email exist in database.",
    },
  });
});

router.post("/login", async (req, res) => {
  const user = await prisma.user.findMany({
    where: {
      OR: [
        { email: req.body.emailOrUsername },
        { username: req.body.emailOrUsername },
      ],
    },
  });

  if (user.length === 1) {
    try {
      if (bcrypt.compareSync(req.body.password, user[0].password)) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        return res.status(200).send({
          token: token,
        });
      }
      return res.status(400).send("Invalid email or password.");
    } catch (error) {
      return res.status(500).send("Unexpected error occurred.");
    }
  }
  return res
    .status(400)
    .send("Invalid email format or email exist in database.");
});

const getHashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
};

module.exports = router;
