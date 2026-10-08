const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const MeetingParticipant = require('../models/MeetingParticipant');
const MeetingMessage = require('../models/MeetingMessage');
const SharedFile = require('../models/SharedFile');
const MeetingRecording = require('../models/MeetingRecording');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/meetings/recent
// @desc    Get user's recent meetings
router.get('/recent', protect, async (req, res) => {
  try {
    const participations = await MeetingParticipant.find({ user: req.user._id })
      .populate('meeting')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Extract unique meetings
    const meetings = participations.map(p => p.meeting).filter(Boolean);
    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/meetings/history
// @desc    Get complete meeting history
router.get('/history', protect, async (req, res) => {
  try {
    const participations = await MeetingParticipant.find({ user: req.user._id })
      .populate('meeting')
      .sort({ createdAt: -1 });
    
    const meetings = participations.map(p => p.meeting).filter(Boolean);
    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/meetings/my-recordings
// @desc    Get all recordings saved by the current user
router.get('/my-recordings', protect, async (req, res) => {
  try {
    const recordings = await MeetingRecording.find({ user: req.user._id })
      .populate('meeting')
      .sort({ createdAt: -1 });
    res.json({ success: true, recordings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/meetings/:id
// @desc    Get specific meeting details including chat and participants
router.get('/:id', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meetingId: req.params.id }).populate('host', 'name email avatar');
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    const participants = await MeetingParticipant.find({ meeting: meeting._id }).populate('user', 'name email avatar');
    const messages = await MeetingMessage.find({ meeting: meeting._id }).populate('sender', 'name avatar');
    const files = await SharedFile.find({ meeting: meeting._id }).populate('uploader', 'name avatar');

    res.json({ 
      success: true, 
      meeting, 
      participants, 
      messages, 
      files 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/meetings/:id/recordings
// @desc    Get recordings for a meeting
router.get('/:id/recordings', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meetingId: req.params.id });
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    const recordings = await MeetingRecording.find({ meeting: meeting._id }).populate('user', 'name avatar');
    res.json({ success: true, recordings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/meetings/:id/recordings
// @desc    Save a recording metadata for a meeting
router.post('/:id/recordings', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meetingId: req.params.id });
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    const recording = new MeetingRecording({
      meeting: meeting._id,
      user: req.user._id,
      fileUrl: req.body.fileUrl,
      duration: req.body.duration,
      size: req.body.size
    });
    
    await recording.save();
    res.json({ success: true, recording });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
