import mongoose from 'mongoose';

const WeatherDataSchema = new mongoose.Schema({
  city: String,
  temp: Number,
  feels_like: Number,
  humidity: Number,
  wind_speed: Number,
  weather_main: String,
  dt: Number,
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

const WeatherData = mongoose.model('WeatherData', WeatherDataSchema);
export default WeatherData;
