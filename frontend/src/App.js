// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WeatherDashboard from './components/WeatherDashboard';
import Thresholds from './components/Thresholds';
import DailySummary from './components/DailySummary';
import Alerts from './components/Alerts';
import HistoricalTrends from './components/HistoricalTrends';

const App = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/weather/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, []);

  // Count unique alert conditions
  const uniqueAlertConditions = [...new Set(alerts.map(alert => alert.conditionType))];
  const alertCount = uniqueAlertConditions.length;

  return (
    <Router>
      <Navbar alertCount={alertCount} />
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/thresholds" element={<Thresholds />} />
        <Route path="/summaries" element={<DailySummary />} />
        <Route path="/alerts" element={<Alerts alerts={alerts} setAlerts={setAlerts} loading={loading} />} />
        <Route path="/trends" element={<HistoricalTrends />} />
      </Routes>
    </Router>
  );
};

export default App;
