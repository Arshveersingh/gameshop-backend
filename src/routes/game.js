const express = require("express");
const apiClient = require("../../services/api-client");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await apiClient.get("/games", {
      params: {
        ...req.query,
      },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});

router.get("/games", async (req, res) => {
  try {
    const response = await apiClient.get("/games", {
      params: {
        ...req.query,
      },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});

router.get("/games/:slug", async (req, res) => {
  const slug = req.params.slug;
  try {
    const response = await apiClient.get(`/games/${slug}`, {
      params: {
        ...req.query,
      },
    });
    console.log(response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});

router.get("/games/:slug/achievements", async (req, res) => {
  const slug = req.params.slug;
  try {
    const response = await apiClient.get(`/games/${slug}/achievements`, {
      params: {
        ...req.query,
      },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});

router.get("/games/:slug/achievements", async (req, res) => {
  const slug = req.params.slug;
  try {
    const response = await apiClient.get(`/games/${slug}/achievements`, {
      params: {
        ...req.query,
      },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});
router.get("/games/:slug/movies", async (req, res) => {
  const slug = req.params.slug;
  try {
    const response = await apiClient.get(`/games/${slug}/movies`, {
      params: {
        ...req.query,
      },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});
router.get("/games/:slug/screenshots", async (req, res) => {
  const slug = req.params.slug;
  try {
    const response = await apiClient.get(`/games/${slug}/screenshots`, {
      params: {
        ...req.query,
      },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});
router.get("/games/:slug/stores", async (req, res) => {
  const slug = req.params.slug;
  try {
    const response = await apiClient.get(`/games/${slug}/stores`, {
      params: {
        ...req.query,
      },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});

module.exports = router;
