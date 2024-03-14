const axios = require("axios");
const path = require("path");

require("dotenv").config({
  path: path.resolve(process.cwd(), "config", ".env"),
});

const axiosInstance = axios.create({
  baseURL: process.env.RAWG_API_BASE_URL,
  params: {
    key: process.env.RAWG_API_KEY,
  },
});

module.exports = axiosInstance;
