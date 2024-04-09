const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const validateUserData = require("../middleware/validation");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/jwtAuth");

const router = express.Router();
const prisma = new PrismaClient();

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
        const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
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

router.get("/liked_games", authenticateToken, async (req, res) => {
  const userId = parseInt(req.body.userId);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (user !== null) {
    return res.status(200).send(user.likedGames);
  }
  return res.status(400).send("Cannot get liked games.");
});

router.put("/like_game/:gameId", authenticateToken, async (req, res) => {
  const userId = parseInt(req.body.userId);
  const gameId = parseInt(req.params.gameId);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (user !== null && !user.likedGames.includes(gameId)) {
    user.likedGames.push(gameId);
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        likedGames: user.likedGames,
      },
    });
    if (updatedUser !== null) {
      return res.status(200).send("Successfully liked game.");
    }
  }
  return res.status(400).send("Error liking game.");
});
router.put("/unlike_game/:gameId", authenticateToken, async (req, res) => {
  const userId = parseInt(req.body.userId);
  const gameId = parseInt(req.params.gameId);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (user !== null && user.likedGames.includes(gameId)) {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        likedGames: {
          set: user.likedGames.filter((id) => id !== gameId),
        },
      },
    });
    if (updatedUser !== null) {
      return res.status(200).send("Game unliked.");
    }
  }
  return res.status(400).send("Error unliking game.");
});

const getHashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
};

module.exports = router;
