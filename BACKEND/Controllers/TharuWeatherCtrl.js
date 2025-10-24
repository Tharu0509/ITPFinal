//cf54b1b297b54430af340708251307

// Controllers/TharuWeatherCtrl.js
const axios = require("axios");
const User = require("../Model/SitharaUserRegModel");
const { isCacheValid } = require("../utils/TharuCacheUtils");

const getUserWeather = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user || !user.farmCity) {
      return res.status(404).json({ message: "User or farm city not found" });
    }

    if (isCacheValid(user.lastWeatherFetched)) {
      return res.status(200).json({ weather: user.lastWeatherData, source: "cache" });
    }

    const apiKey = process.env.WEATHERAPI_KEY || "cf54b1b297b54430af340708251307";
    let url;

    if (user.farmCity.toLowerCase() === "sooriyawewa") {
      if (user.latitude == null || user.longitude == null) {
        return res.status(400).json({ message: "Latitude and longitude not set for Sooriyawewa user" });
      }
      url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${user.latitude},${user.longitude}`;
    } else {
      url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${user.farmCity}`;
    }

    const response = await axios.get(url);

    const weatherData = {
      city: response.data.location.name,
      temperature: `${response.data.current.temp_c}°C`,
      condition: response.data.current.condition.text,
      icon: `https:${response.data.current.condition.icon}`,
      windSpeed: `${response.data.current.wind_kph} kph`,
      country: response.data.location.country,
      lastUpdated: response.data.current.last_updated,
    };

    user.lastWeatherData = weatherData;
    user.lastWeatherFetched = new Date();
    await user.save();

    return res.status(200).json({ weather: weatherData, source: "live" });

  } catch (err) {
    console.error("Weather API error:", err.message);
    if (err.response) {
      return res.status(err.response.status).json({
        message: err.response.data.error?.message || "Weather API error"
      });
    }
    return res.status(500).json({ message: "Failed to fetch weather" });
  }
};

module.exports = { getUserWeather };
