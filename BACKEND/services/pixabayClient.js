const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ debug: false });

const apiBaseUrl = process.env.PIXABAY_API_BASE_URL;
const apiKey = process.env.PIXABAY_API_KEY;

if (!apiBaseUrl || !apiKey) {
  throw new Error(
    "Pixabay API base URL or API key not set in environment variables"
  );
}

const pixabayClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 5000,
  params: {
    key: apiKey,
    image_type: "photo",
  },
});

module.exports = { pixabayClient };
