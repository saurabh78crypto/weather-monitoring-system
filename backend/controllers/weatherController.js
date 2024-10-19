import axios from 'axios';
import WeatherData from '../models/WeatherData.js';
import DailySummary from '../models/DailySummary.js';
import Thresholds from '../models/Thresholds.js';
import Alert from '../models/Alert.js';
import { checkThresholds } from '../utils/alert.js';

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

const fetchWeatherData = async () => {
  const API_KEY = process.env.OPEN_WEATHER_API_KEY;
  const fetchData = [];
  
  for (const city of cities) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );

      if (response.status !== 200) {
        console.error(`Error fetching weather data for ${city}: ${response.status} - ${response.statusText}`);
        continue; 
      }

      const weatherData = response.data;
      const temp = weatherData.main.temp - 273.15; // Convert from Kelvin to Celsius
      const feels_like = weatherData.main.feels_like - 273.15;
      const humidity = weatherData.main.humidity;
      const wind_speed = weatherData.wind.speed;
      const weather_main = weatherData.weather[0].main;

      // Save raw weather data to the database
      const newWeatherData = new WeatherData({
        city,
        temp,
        feels_like,
        humidity,
        wind_speed,
        weather_main,
        dt: weatherData.dt,
      });
      await newWeatherData.save();

      // Add to the fetched data array
      fetchData.push({
        city,
        temp,
        feels_like,
        humidity,
        wind_speed,
        weather_main,
        dt: weatherData.dt,
      });

      // Process alerts (check temperature thresholds)
      checkThresholds(city, temp, humidity, wind_speed);

    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error.message);
    }
  }

  return fetchData;
};


// Utility to find the most frequent weather condition
const findMostFrequent = (arr) => {
  return arr.sort((a,b) =>
    arr.filter(v => v===a).length - arr.filter(v => v===b).length
  ).pop();
};

// Dynamic reason generation for dominant weather
const getWeatherReason = (weather) => {
  const { main, description } = weather;

  // Construct a reason using the description directly
  let reason = `The dominant weather condition is ${description}.`;
  
  // Optionally, append more context
  if (main) {
    reason += ` This indicates that it's likely to be ${main.toLowerCase()}.`;
  }

  return reason;
};

// Rollup data for daily summary
const calculateDailySummary = async () => {
  const today = new Date().setUTCHours(0, 0, 0, 0);
  
  for (const city of cities) {
    try {
      const weatherDataForToday = await WeatherData.find({
        city,
        timestamp: { $gte: today },
      });
      
      if (weatherDataForToday.length > 0) {
        const temps = weatherDataForToday.map(data => data.temp);
        const humidities = weatherDataForToday.map(data => data.humidity);
        const windSpeeds = weatherDataForToday.map(data => data.wind_speed);
        const weatherConditions = weatherDataForToday.map(data => data.weather_main || 'Unknown');

        const avg_temp = temps.reduce((a, b) => a + b) / temps.length;
        const max_temp = Math.max(...temps);
        const min_temp = Math.min(...temps);
        const avg_humidity = humidities.reduce((a, b) => a + b) / humidities.length;
        const avg_wind_speed = windSpeeds.reduce((a, b) => a + b) / windSpeeds.length;
        const dominant_weather = findMostFrequent(weatherConditions);

        // Save daily summary
        const dailySummary = new DailySummary({
          city,
          avg_temp,
          max_temp,
          min_temp,
          avg_humidity,
          avg_wind_speed,
          dominant_weather,
          date: today,
        });

        await dailySummary.save();
      }
    } catch (error) {
      console.error(`Error calculating daily summary for ${city}:`, error.message);
    }
  }
};


const fetchThreshholds = async (req, res) => {
  try {
    const thresholds = await Thresholds.find();

    if (!thresholds || thresholds.length === 0) {
      return res.status(404).json({ message: 'No thresholds defined for any city.' });
    }

    // Fetch latest weather data for all cities and compare with thresholds
    const allWeatherData = await WeatherData.find().sort({ timestamp: -1 }).limit(thresholds.length);

    for (const threshold of thresholds) {
      const { city } = threshold;
      
      const cityWeatherData = allWeatherData.find(data => data.city === city);
      
      if (cityWeatherData) {
        // Check if any threshold exceeds the defined limits
         await checkThresholds(
          city,
          cityWeatherData.temp,
          cityWeatherData.humidity,
          cityWeatherData.wind_speed
        );

      }
    }

    res.json(thresholds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching and checking thresholds', error: error.message });
  }
};


// Fetch all alerts
const fetchAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });  
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
};

// Fetch alerts for a specific city
const fetchCityAlerts = async (req, res) => {
  const city = req.params.city;
  try {
    const alerts = await Alert.find({ city }).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: `Error fetching alerts for ${city}`, error: error.message });
  }
};

const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    await Alert.findByIdAndDelete(id); // Deletes the alert from the database
    res.status(204).send(); // No content to send back
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).send('Server Error');
  }

}


// Fetch historical weather data for a specific date range
const fetchHistoricalTrends = async (req, res) => {
  const { city, start, end } = req.query;
  
  // Convert start and end query params to date objects
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Check if the startDate and endDate are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date format for start or end.' });
  }

  try {
    // Query to fetch data for the specified city and date range
    const query = {
      timestamp: { $gte: startDate, $lte: endDate },
    };

    if (city) {
      query.city = city;
    }

    const weatherData = await WeatherData.find(query).sort({ timestamp: 1 });

    if (weatherData.length === 0) {
      return res.status(404).json({ message: 'No weather data found for the specified range.' });
    }
    
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching historical trends', error: error.message });
  }
};


export { fetchWeatherData, calculateDailySummary, fetchThreshholds, fetchAllAlerts, 
         fetchCityAlerts, fetchHistoricalTrends, deleteAlert };
