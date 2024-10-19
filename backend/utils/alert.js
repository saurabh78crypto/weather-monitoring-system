import nodemailer from 'nodemailer';
import Thresholds from '../models/Thresholds.js';
import Alert from '../models/Alert.js';

let previousTemperature = {};
let previousHumidity = {};
let previousWindSpeed = {};

let alertSentTemperature = {}; // Track if alert has been sent for temperature
let alertSentHumidity = {};    // Track if alert has been sent for humidity
let alertSentWindSpeed = {};   // Track if alert has been sent for wind speed

const checkThresholds = async (city, temp, humidity, wind_speed) => {
  const email = process.env.ALERT_EMAIL; // Email to send alerts to

  // Fetch user-defined thresholds
  const thresholds = await Thresholds.findOne({ city });
  if (!thresholds) {
    console.error(`No thresholds found for city: ${city}`);
    return; 
  }

  const tempThreshold = thresholds.temperature || 35;
  const humidityThreshold = thresholds.humidity || 90;
  const windSpeedThreshold = thresholds.wind_speed || 10;

  // Trigger temperature alert
  if (temp > tempThreshold) {
    if (!alertSentTemperature[city]) { // Check if alert has not been sent
      await sendAlert(city, temp, email, 'Temperature', tempThreshold, humidityThreshold, windSpeedThreshold);
      alertSentTemperature[city] = true; // Mark alert as sent
    }
  } else {
    alertSentTemperature[city] = false; // Reset if under threshold
  }
  previousTemperature[city] = temp;

  // Trigger humidity alert
  if (humidity > humidityThreshold) {
    if (!alertSentHumidity[city]) { // Check if alert has not been sent
      await sendAlert(city, humidity, email, 'Humidity', tempThreshold, humidityThreshold, windSpeedThreshold);
      alertSentHumidity[city] = true; // Mark alert as sent
    }
  } else {
    alertSentHumidity[city] = false; // Reset if under threshold
  }
  previousHumidity[city] = humidity;

  // Trigger wind speed alert
  if (wind_speed > windSpeedThreshold) {
    if (!alertSentWindSpeed[city]) { // Check if alert has not been sent
      await sendAlert(city, wind_speed, email, 'Wind Speed', tempThreshold, humidityThreshold, windSpeedThreshold);
      alertSentWindSpeed[city] = true; // Mark alert as sent
    }
  } else {
    alertSentWindSpeed[city] = false; // Reset if under threshold
  }
  previousWindSpeed[city] = wind_speed;
};

const sendAlert = async (city, value, email, conditionType, tempThreshold, humidityThreshold, windSpeedThreshold) => {
  const threshold = conditionType === 'Temperature' ? tempThreshold
    : conditionType === 'Humidity' ? humidityThreshold
    : windSpeedThreshold;

  const message = `The ${conditionType} in ${city} is ${value}, which exceeds the threshold of ${threshold}.`;
  console.log(`Alert! ${city} ${conditionType} exceeded threshold: ${value}`);

  const alert = new Alert({
    city,
    conditionType,
    value,
    threshold,
    message,
  });

  await alert.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: `Weather Alert for ${city}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending alert email:', error);
    } else {
      console.log('Alert email sent:', info.response);
    }
  });
};

export { checkThresholds };
