import mongoose from 'mongoose';

const ThresholdsSchema = new mongoose.Schema({
  city: { 
    type: String, 
    required: true 
  },
  temperature: { 
    type: Number, 
    required: true 
  },
  humidity: { 
    type: Number, 
    required: true 
  },
  wind_speed: { 
    type: Number, 
    required: true 
  },
});

const Thresholds = mongoose.model('Thresholds', ThresholdsSchema);
export default Thresholds;
