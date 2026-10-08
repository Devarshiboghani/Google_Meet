const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  meeting: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Meeting', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: Number 
  },
  size: { 
    type: Number 
  }
}, { timestamps: true });

module.exports = mongoose.model('MeetingRecording', recordingSchema);
