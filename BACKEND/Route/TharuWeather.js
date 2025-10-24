// Route/TharuWeather.js
const express = require("express");
const router = express.Router();
const { getUserWeather } = require("../Controllers/TharuWeatherCtrl");

router.get("/:id", getUserWeather);

// Optional test route with static lat/lon for testing
router.get("/test", async (req, res) => {
  const apiKey = process.env.WEATHERAPI_KEY || "YOUR_WEATHERAPI_KEY";
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=6.2713,80.9820`
    );
    const weatherData = {
      city: response.data.location.name,
      temperature: `${response.data.current.temp_c}°C`,
      condition: response.data.current.condition.text,
      icon: `https:${response.data.current.condition.icon}`,
      windSpeed: `${response.data.current.wind_kph} kph`,
      country: response.data.location.country,
      lastUpdated: response.data.current.last_updated,
    };
    res.status(200).json({ weather: weatherData, source: "live" });
  } catch (err) {
    console.error("Test Weather API error:", err.message);
    res.status(500).json({ message: "Failed to fetch weather" });
  }
});

module.exports = router;
