import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaCity, FaCalendarAlt } from 'react-icons/fa';

// Register components for chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HistoricalTrends = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Delhi');
  const [startDate, setStartDate] = useState('2024-10-17');
  const [endDate, setEndDate] = useState('2024-10-18');
  const [noData, setNoData] = useState(false); // State to handle no data
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const fetchHistoricalData = async () => {
    setLoading(true);
    setNoData(false); // Reset no data state
    setErrorMessage(''); // Reset error message
    try {
      const response = await axios.get('http://localhost:5000/api/weather/historical', {
        params: { city, start: startDate, end: endDate },
      });

      if (response.data.length === 0 || response.data.message === "No weather data found for the specified range.") {
        setNoData(true); // Set no data state if response is empty or has the specific message
        setErrorMessage('This range doesn’t have data. Please enter your start date from October 17, 2024.');
      } else {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setErrorMessage('An error occurred while fetching data. Please try again.'); // Set generic error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [city, startDate, endDate]);

  if (loading) return <Loader />;

  // Step 1: Group data by date and calculate the average temperature for each day
  const dailyData = data.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { tempSum: 0, count: 0 };
    }
    acc[date].tempSum += item.temp;
    acc[date].count += 1;
    return acc;
  }, {});

  // Step 2: Create labels and temperatures arrays for the chart
  const labels = Object.keys(dailyData);
  const temperatures = labels.map(date => (dailyData[date].tempSum / dailyData[date].count).toFixed(2)); // Average temperature

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average Temperature (°C)',
        data: temperatures,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Historical Temperature Trends</h2>

      {/* Filter Section: City Dropdown and Date Inputs in a single line */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <div className="form-group mx-1">
          <label htmlFor="city" className="form-label">
            <FaCity className="me-1" /> Select City:
          </label>
          <select
            id="city"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>

        <div className="form-group mx-1">
          <label htmlFor="startDate" className="form-label">
            <FaCalendarAlt className="me-1" /> Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group mx-1">
          <label htmlFor="endDate" className="form-label">
            <FaCalendarAlt className="me-1" /> End Date:
          </label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Display messages if no data is available for the selected range */}
      {noData && (
        <p className="text-danger text-center">{errorMessage}</p>
      )}

      {/* Chart Container */}
      <div style={{ height: '400px', position: 'relative' }}>
        {labels.length > 0 ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: '#333',
                  },
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  callbacks: {
                    label: function (context) {
                      return `${context.dataset.label}: ${context.raw} °C`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    color: '#333',
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Temperature (°C)',
                    color: '#333',
                  },
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
              },
            }}
          />
        ) : (
          <p className="text-center">No temperature data to display.</p>
        )}
      </div>
    </div>
  );
};

export default HistoricalTrends;
