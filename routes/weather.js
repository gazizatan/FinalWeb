import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// 📌 Get weather data by city
router.get("/weather/:city", async (req, res) => {
    try {
        const { city } = req.params;
        console.log(`📍 Fetching weather for: ${city}`);

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        const { data: weather } = await axios.get(weatherURL);

        res.status(200).json({
            city: weather.name,
            country: weather.sys.country,
            flag: `https://flagcdn.com/w320/${weather.sys.country.toLowerCase()}.png`,
            temperature: weather.main.temp,
            feels_like: weather.main.feels_like,
            description: weather.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            humidity: weather.main.humidity,
            pressure: weather.main.pressure,
            wind_speed: weather.wind.speed,
            lat: weather.coord.lat, // 🌍 Latitude
            lon: weather.coord.lon  // 🌍 Longitude
        });
    } catch (error) {
        console.error("❌ Weather API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

// 📰 Get news by country
router.get("/news/:country", async (req, res) => {
    try {
        const { country } = req.params;
        console.log(`📰 Fetching news for country: ${country}`);

        const newsURL = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${NEWS_API_KEY}`;
        const { data: news } = await axios.get(newsURL);

        res.status(200).json(news.articles.slice(0, 5));
    } catch (error) {
        console.error("❌ News API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch news data" });
    }
});

export default router;
