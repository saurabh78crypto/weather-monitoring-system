import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { Table, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap is imported

const Thresholds = () => {
  const [thresholds, setThresholds] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchThresholds = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/weather/thresholds');
      setThresholds(response.data);
      const initialInputValues = response.data.reduce((acc, threshold) => {
        acc[threshold.city] = {
          temperature: threshold.temperature || '',
          humidity: threshold.humidity || '',
          wind_speed: threshold.wind_speed || '',
        };
        return acc;
      }, {});
      setInputValues(initialInputValues);
    } catch (error) {
      console.error("Error fetching thresholds:", error);
      setErrorMessage('Failed to fetch thresholds. Please try again later.');
      setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
    } finally {
      setLoading(false); 
    }
  };

  const updateThreshold = async (city) => {
    try {
      await axios.put(`http://localhost:5000/api/weather/thresholds/${city}`, {
        temperature: inputValues[city].temperature,
        humidity: inputValues[city].humidity,
        wind_speed: inputValues[city].wind_speed,
      });
      setSuccessMessage(`Threshold for ${city} updated successfully!`);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error("Error updating threshold:", error);
      setErrorMessage(`Failed to update threshold for ${city}.`);
      setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
    }
  };

  const createThreshold = async (city) => {
    try {
      await axios.post('http://localhost:5000/api/weather/thresholds', {
        city,
        temperature: inputValues[city].temperature,
        humidity: inputValues[city].humidity,
        wind_speed: inputValues[city].wind_speed,
      });
      setSuccessMessage(`Threshold for ${city} created successfully!`);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error("Error creating threshold:", error);
      setErrorMessage(`Failed to create threshold for ${city}.`);
      setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
    }
  };

  const handleInputChange = (city, field, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [city]: {
        ...prevValues[city],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    fetchThresholds();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mt-4">
      <h2 className='text-center mb-4'>Manage Weather Thresholds</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>City</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Wind Speed (m/s)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {thresholds.map((threshold) => (
            <tr key={threshold.city}>
              <td>{threshold.city}</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={inputValues[threshold.city]?.temperature || ''}
                  onChange={(e) => handleInputChange(threshold.city, 'temperature', e.target.value)}
                  placeholder={threshold.temperature}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={inputValues[threshold.city]?.humidity || ''}
                  onChange={(e) => handleInputChange(threshold.city, 'humidity', e.target.value)}
                  placeholder={threshold.humidity}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={inputValues[threshold.city]?.wind_speed || ''}
                  onChange={(e) => handleInputChange(threshold.city, 'wind_speed', e.target.value)}
                  placeholder={threshold.wind_speed}
                />
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => updateThreshold(threshold.city)}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Thresholds;
