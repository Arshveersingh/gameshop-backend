const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
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
        return res.status(201).send("User created in database.");
      }
    } catch (error) {
      return res.status(500).send("Unexpected error.");
    }
  }
  return res.status(409).send("Email already exists in database.");
});

router.post("/login", async (req, res) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser) {
    try {
      if (bcrypt.compareSync(req.body.password, existingUser.password)) {
        return res.status(200).send("Login successful");
      }
      return res.status(400).send("Invalid email or password.");
    } catch (error) {
      console.log("Error creating user:", error);
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
