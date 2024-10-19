import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  city: { 
    type: String, 
    required: true 
  },
  conditionType: 
  { 
    type: String,
    required: true 
 },  
  value: 
  { 
    type: Number,
    required: true 
 },          
  threshold: 
  { 
    type: Number,
    required: true 
 },      
  message: 
  { 
    type: String,
    required: true 
},        
  timestamp: 
  { 
    type: Date, 
    default: Date.now
 },     
});

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
