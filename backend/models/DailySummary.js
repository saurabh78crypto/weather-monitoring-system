import mongoose from 'mongoose';

const DailySummarySchema = new mongoose.Schema({
  city: String,
  avg_temp: Number,
  max_temp: Number,
  min_temp: Number,
  avg_humidity: Number,
  avg_wind_speed: Number,
  dominant_weather: String,
  dominant_weather_reason: String,
  date: { 
    type: Date, 
    default: Date.now 
  },
});

const DailySummary = mongoose.model('DailySummary', DailySummarySchema);
export default DailySummary;
