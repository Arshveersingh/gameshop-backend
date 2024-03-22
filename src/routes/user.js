const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const validateUserData = require("../middleware/validation");
const jwt = require("jsonwebtoken");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/signup", validateUserData, async (req, res) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser === null) {
    try {
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
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
      return res.status(500).send("Unexpected error.");
    }
  }
  return res.status(409).send("Email already exists in database.");
});

router.post("/login", validateUserData, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    try {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        return res.status(201).send({
          token: token,
        });
      }
      return res.status(400).send("Invalid email or password.");
    } catch (error) {
      return res.status(500).send("Unexpected error occurred.");
    }
  }
  return res.status(400).send("Invalid email or password.");
});

const getHashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
};

module.exports = router;
