const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  meeting: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Meeting', 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String 
  },
  type: { 
    type: String, 
    enum: ['text', 'file'], 
    default: 'text' 
  },
  fileMetadata: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SharedFile' 
  }
}, { timestamps: true });

module.exports = mongoose.model('MeetingMessage', messageSchema);
