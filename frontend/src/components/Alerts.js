import React from 'react';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import { BsExclamationTriangle, BsCheckCircle } from 'react-icons/bs';

const Alerts = ({ alerts, setAlerts, loading }) => {
  
  const removeAlert = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/weather/alerts/${id}`);
      setAlerts((prevAlerts) => prevAlerts.filter(alert => alert._id !== id));
    } catch (error) {
      console.error('Error removing alert:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  const uniqueAlerts = {};
  const latestAlerts = alerts
    .filter(alert => {
      if (!uniqueAlerts[alert.conditionType]) {
        uniqueAlerts[alert.conditionType] = alert;
        return true;
      }
      const existingAlert = uniqueAlerts[alert.conditionType];
      if (new Date(alert.timestamp) > new Date(existingAlert.timestamp)) {
        uniqueAlerts[alert.conditionType] = alert;
      }
      return false;
    })
    .map(alert => uniqueAlerts[alert.conditionType]);

  // Color mapping for different alert types
  const alertColors = {
    severe: { bg: 'bg-danger', text: 'text-white' }, // Red for severe alerts
    warning: { bg: 'bg-info', text: 'text-dark' },  // Light blue for warnings
    normal: { bg: 'bg-light', text: 'text-dark' },   // Light gray for normal alerts
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Weather Alerts</h2>
      {latestAlerts.length === 0 && <p>No alerts at the moment.</p>}
      {latestAlerts.map((alert) => {
        const { bg, text } = alertColors[alert.severity] || alertColors.normal; // Default to normal
        return (
          <Card key={alert._id || alert.id} className="mb-3" style={{ transition: 'all 0.3s ease', border: '1px solid #ccc' }}>
            <Card.Header className={`${bg} ${text}`}>
              <div className="d-flex align-items-center">
                {alert.severity === 'severe' ? <BsExclamationTriangle size={24} className="me-2" /> : <BsCheckCircle size={24} className="me-2" />}
                {alert.city} - {alert.conditionType} Alert
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>{alert.message}</Card.Text>
              <Button
                variant="outline-danger" // Outline variant for a softer look
                onClick={() => removeAlert(alert._id || alert.id)}
                data-bs-toggle="tooltip"
                title="Dismiss this alert"
              >
                Dismiss
              </Button>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default Alerts;
