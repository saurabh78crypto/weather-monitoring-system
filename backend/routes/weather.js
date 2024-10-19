import express from 'express';
const router = express.Router();
import DailySummary from '../models/DailySummary.js';
import Thresholds from '../models/Thresholds.js';
import { fetchWeatherData, calculateDailySummary, fetchThreshholds, fetchAllAlerts, 
         fetchCityAlerts, fetchHistoricalTrends, deleteAlert } 
    from '../controllers/weatherController.js';

// Endpoint to trigger weather data fetch and return the data
router.get('/fetch', async (req, res) => {
  try {
    const fetchedData = await fetchWeatherData(); 
    res.json(fetchedData); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
});

// Endpoint to fetch all alerts
router.get('/alerts', fetchAllAlerts);

// Endpoint to fetch alerts for a specific city
router.get('/alerts/:city', fetchCityAlerts);

// Endpoint to delete alert
router.delete('/alerts/:id', deleteAlert);

// Endpoint to fetch historical weather trends for a date range and optional city
router.get('/historical', fetchHistoricalTrends);


// Endpoint to get daily summaries
router.get('/summaries', async (req, res) => {
  const summaries = await DailySummary.find();
  res.json(summaries);
});

// Endpoint to trigger daily summary calculation manually
router.get('/calculate-summary', async (req, res) => {
  await calculateDailySummary();
  res.send('Daily summary calculated successfully');
});


// Endpoint to fetch thresholds and weather data for all cities and check against the user-configurable thresholds
router.get('/thresholds', fetchThreshholds);


// Endpoint to get thresholds for a city
router.get('/thresholds/:city', async (req, res) => {
  const city = req.params.city;
  const thresholds = await Thresholds.findOne({ city });

  if (!thresholds) {
    return res.status(404).json({ message: 'Thresholds not found for this city.' });
  }

  res.json(thresholds);
});
  
// Endpoint to update thresholds for a city
router.put('/thresholds/:city', async (req, res) => {
  const city = req.params.city;
  const { temperature, humidity, wind_speed } = req.body;

  const thresholds = await Thresholds.findOneAndUpdate(
    { city },
    { temperature, humidity, wind_speed },
    { new: true, upsert: true }
  );

  res.json(thresholds);
});

export default router;
