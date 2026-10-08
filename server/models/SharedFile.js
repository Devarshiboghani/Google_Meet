const mongoose = require('mongoose');

const sharedFileSchema = new mongoose.Schema({
  meeting: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Meeting'
  },
  uploader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  fileName: { 
    type: String, 
    required: true 
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  fileSize: { 
    type: Number 
  },
  mimeType: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('SharedFile', sharedFileSchema);
