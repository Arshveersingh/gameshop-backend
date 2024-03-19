const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: process.env.RAWG_API_URL,
  params: {
    key: process.env.RAWG_API_KEY,
  },
});

module.exports = axiosInstance;
