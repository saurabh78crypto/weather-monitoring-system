import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { Card, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { WiDaySunny, WiRain, WiStrongWind, WiCloudy } from 'react-icons/wi'; 

const weatherIcons = {
  Clear: <WiDaySunny size={40} color="#FFD700" />,
  Rain: <WiRain size={40} color="#007BFF" />,
  Wind: <WiStrongWind size={40} color="#28A745" />,
  Clouds: <WiCloudy size={40} color="#6C757D" />,
};

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:5000/api/weather/fetch');
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading) return <Loader />; 

  return (
    <div className="container mt-4" style={{ background: 'linear-gradient(to right, #e0eafc, #cfdef3)', padding: '20px', borderRadius: '10px' }}>
      <h2 className='text-center mb-4' style={{ color: '#343a40' }}>Current Weather Data</h2>
      <Row>
        {weatherData.map((data) => (
          <Col md={4} sm={6} xs={12} key={data.city} className="mb-4">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-${data.city}`}>Weather condition: {data.weather_main}</Tooltip>}
            >
              <Card className="shadow-sm border rounded" style={{ transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <Card.Body className="text-center">
                  <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{data.city}</h5>
                  <div className="mb-3">{weatherIcons[data.condition] || <WiCloudy size={40} />}</div>
                  <h6 className="card-subtitle mb-2 text-muted">Temperature: <span style={{ fontWeight: 'bold', color: '#007BFF' }}>{data.temp.toFixed(1)}°C</span></h6>
                  <p className="card-text" style={{ margin: 0 }}>Humidity: <span style={{ fontWeight: 'bold' }}>{data.humidity}%</span></p>
                  <p className="card-text" style={{ margin: 0 }}>Wind Speed: <span style={{ fontWeight: 'bold' }}>{data.wind_speed} m/s</span></p>
                </Card.Body>
              </Card>
            </OverlayTrigger>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WeatherDashboard;
