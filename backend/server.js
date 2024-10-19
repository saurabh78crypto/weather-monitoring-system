import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import weatherRoutes from './routes/weather.js';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { fetchWeatherData, calculateDailySummary } from './controllers/weatherController.js';

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
let corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}   
app.use(cors(corsOptions));
app.use('/api/weather', weatherRoutes);

// Schedule the weather data fetching every 5 minutes
cron.schedule('*/5 * * * *', fetchWeatherData);

// Schedule daily summary calculation at midnight
cron.schedule('0 0 * * *', calculateDailySummary);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
