const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  meetingId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'ended'], 
    default: 'active' 
  },
  duration: { 
    type: Number, 
    default: 0 
  },
  endedAt: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
