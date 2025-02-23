import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

router.get("/:city", async (req, res) => {
    try {
        const city = req.params.city;

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        const { data: weather } = await axios.get(weatherURL);

        const airQualityURL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${weather.coord.lat}&lon=${weather.coord.lon}&appid=${WEATHER_API_KEY}`;
        const { data: air } = await axios.get(airQualityURL);

        const aqi = air.list[0].main.aqi;
        const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1];

        const countryCode = weather.sys.country;
        const flagURL = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

        res.status(200).json({
            city: weather.name,
            country: countryCode,
            flag: flagURL,
            temperature: weather.main.temp,
            feels_like: weather.main.feels_like,
            description: weather.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            humidity: weather.main.humidity,
            pressure: weather.main.pressure,
            wind_speed: weather.wind.speed,
            aqi: aqiText,
            lat: weather.coord.lat,
            lon: weather.coord.lon
        });
    } catch (error) {
        console.error("❌ Weather API Error:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

export default router;
