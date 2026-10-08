const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
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
  joinTime: { 
    type: Date, 
    default: Date.now 
  },
  leaveTime: { 
    type: Date 
  },
  duration: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('MeetingParticipant', participantSchema);
