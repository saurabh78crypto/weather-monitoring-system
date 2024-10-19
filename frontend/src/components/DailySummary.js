import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { ProgressBar, Card, Row, Col } from 'react-bootstrap';
import { WiDaySunny, WiRain, WiStrongWind, WiCloudy } from 'react-icons/wi'; 

const weatherIcons = {
  Clear: <WiDaySunny size={40} color="#FFD700" />,
  Rain: <WiRain size={40} color="#007BFF" />,
  Wind: <WiStrongWind size={40} color="#28A745" />,
  Clouds: <WiCloudy size={40} color="#6C757D" />,
};

const DailySummary = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/weather/summaries');
      setSummaries(response.data);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Daily Weather Summaries</h2>
      <Row>
        {summaries.map(summary => (
          <Col md={4} key={summary.city} className="mb-4">
            <Card className="shadow rounded" style={{ background: '#f8f9fa' }}>
              <Card.Body>
                <Card.Title className="text-center">{summary.city}</Card.Title>
                <div className="text-center mb-3">{weatherIcons[summary.dominant_weather] || <WiCloudy size={40} />}</div>
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Avg Temp: </strong>
                  <span>{summary.avg_temp.toFixed(1)}°C</span>
                </div>
                <ProgressBar 
                  now={summary.avg_temp} 
                  min={-10} 
                  max={50} 
                  variant="info" // Light blue for avg temperature
                  style={{ height: '10px' }} 
                />
                
                <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                  <strong>Humidity: </strong>
                  <span>{summary.avg_humidity.toFixed(1)}%</span>
                </div>
                <ProgressBar 
                  now={summary.avg_humidity} 
                  min={0} 
                  max={100} 
                  variant="primary" // Blue for humidity
                  style={{ height: '10px' }} 
                />
                
                <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                  <strong>Wind Speed: </strong>
                  <span>{summary.avg_wind_speed.toFixed(1)} m/s</span>
                </div>
                <ProgressBar 
                  now={summary.avg_wind_speed} 
                  min={0} 
                  max={40} 
                  variant="success" // Green for wind speed
                  style={{ height: '10px' }} 
                />

                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Max Temp: </strong>
                    <span>{summary.max_temp.toFixed(1)}°C</span>
                  </div>
                  <ProgressBar 
                    now={summary.max_temp} 
                    min={-10} 
                    max={50} 
                    variant="danger" // Red for max temperature
                    style={{ height: '10px' }} 
                  />

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <strong>Min Temp: </strong>
                    <span>{summary.min_temp.toFixed(1)}°C</span>
                  </div>
                  <ProgressBar 
                    now={summary.min_temp} 
                    min={-10} 
                    max={50} 
                    variant="info" // Light blue for min temperature
                    style={{ height: '10px' }} 
                  />
                  
                  <div className="mt-3">
                    <strong>Dominant Weather: </strong>{summary.dominant_weather}<br />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DailySummary;
