const { Server } = require('socket.io');
const Meeting = require('../models/Meeting');
const MeetingParticipant = require('../models/MeetingParticipant');
const MeetingMessage = require('../models/MeetingMessage');
const SharedFile = require('../models/SharedFile');

let io;

// Basic in-memory storage for active meeting rooms and participants
const activeRooms = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected via Socket.IO: ${socket.id}`);

    // Create a meeting
    socket.on('create-meeting', async ({ meetingId, hostId }) => {
      try {
        let meeting = await Meeting.findOne({ meetingId });
        if (!meeting) {
          // If valid mongo id, create meeting
          if (hostId && hostId.length === 24) {
            meeting = await Meeting.create({ meetingId, host: hostId });
            console.log(`Meeting ${meetingId} saved to database by host ${hostId}`);
          }
        }
        
        // Also track in memory
        if (!activeRooms.has(meetingId)) {
          activeRooms.set(meetingId, { 
            participants: new Map(), 
            hostId,
            dbId: meeting ? meeting._id : null
          });
        } else {
          activeRooms.get(meetingId).hostId = hostId;
          activeRooms.get(meetingId).dbId = meeting ? meeting._id : null;
        }
      } catch (error) {
        console.error('Error creating meeting in DB:', error.message);
      }
    });

    // Join a meeting room
    socket.on('join-meeting', async ({ meetingId, user }) => {
      if (!meetingId || typeof meetingId !== 'string' || meetingId.length < 5) {
        return socket.emit('room-error', { message: 'Invalid Meeting ID format.' });
      }

      if (!activeRooms.has(meetingId)) {
        activeRooms.set(meetingId, { participants: new Map(), hostId: user?.id });
      }

      const roomData = activeRooms.get(meetingId);
      const isHost = roomData.hostId === user?.id;
      
      const participant = {
        socketId: socket.id,
        userId: user?.id || `guest-${socket.id.substring(0, 5)}`,
        name: user?.name || `Guest ${Math.floor(Math.random() * 1000)}`,
        isHost,
        joinedAt: new Date()
      };
      
      roomData.participants.set(socket.id, participant);
      socket.join(meetingId);
      socket.meetingId = meetingId;
      socket.userId = participant.userId;

      console.log(`User ${participant.name} (${socket.id}) joined meeting room: ${meetingId}`);

      // Save Participant to DB
      try {
        let dbMeeting = await Meeting.findOne({ meetingId });
        if (dbMeeting && user?.id && user.id.length === 24) {
          const pRecord = await MeetingParticipant.create({
            meeting: dbMeeting._id,
            user: user.id,
            joinTime: participant.joinedAt
          });
          participant.dbId = pRecord._id; // Store to update leave time later
        }
      } catch(err) {
        console.error('Error saving participant to DB:', err.message);
      }

      const participantsList = Array.from(roomData.participants.values());
      socket.emit('participants-list', participantsList);
      socket.to(meetingId).emit('participant-joined', participant);
    });

    socket.on('webrtc-offer', ({ offer, to }) => {
      socket.to(to).emit('webrtc-offer', { offer, from: socket.id });
    });

    socket.on('webrtc-answer', ({ answer, to }) => {
      socket.to(to).emit('webrtc-answer', { answer, from: socket.id });
    });

    socket.on('webrtc-ice-candidate', ({ candidate, to }) => {
      socket.to(to).emit('webrtc-ice-candidate', { candidate, from: socket.id });
    });

    socket.on('toggle-media', ({ meetingId, type, isEnabled }) => {
      socket.to(meetingId).emit('participant-media-changed', {
        socketId: socket.id,
        type,
        isEnabled
      });
    });

    socket.on('send-message', async (data) => {
      socket.to(data.meetingId).emit('receive-message', data);
      
      // Save message to DB
      try {
        const meeting = await Meeting.findOne({ meetingId: data.meetingId });
        if (meeting && data.senderId && data.senderId.length === 24) {
          let fileObjId = null;
          
          if (data.type === 'file') {
            const newFile = await SharedFile.create({
              meeting: meeting._id,
              uploader: data.senderId,
              fileName: data.file.fileName,
              fileUrl: data.file.fileUrl,
              fileSize: data.file.fileSize,
              mimeType: data.file.mimeType
            });
            fileObjId = newFile._id;
          }

          await MeetingMessage.create({
            meeting: meeting._id,
            sender: data.senderId,
            content: data.type === 'text' ? data.message : null,
            type: data.type,
            fileMetadata: fileObjId
          });
        }
      } catch (err) {
        console.error("Error saving message to DB:", err.message);
      }
    });

    socket.on('raise-hand', ({ meetingId, userName }) => {
      socket.to(meetingId).emit('participant-hand-status', { 
        socketId: socket.id, isRaised: true, userName
      });
    });

    socket.on('lower-hand', ({ meetingId }) => {
      socket.to(meetingId).emit('participant-hand-status', { 
        socketId: socket.id, isRaised: false 
      });
    });

    socket.on('leave-meeting', () => {
      handleLeaveRoom(socket);
    });

    const verifyHost = (socket, meetingId) => {
      const roomData = activeRooms.get(meetingId);
      if (!roomData) return false;
      return roomData.hostId === socket.userId;
    };

    socket.on('host-mute-participant', ({ meetingId, targetSocketId }) => {
      if (!verifyHost(socket, meetingId)) return socket.emit('room-error', { message: 'Unauthorized' });
      const roomData = activeRooms.get(meetingId);
      if (roomData && roomData.participants.has(targetSocketId)) {
        socket.to(targetSocketId).emit('host-muted-you');
      }
    });

    socket.on('host-remove-participant', ({ meetingId, targetSocketId }) => {
      if (!verifyHost(socket, meetingId)) return socket.emit('room-error', { message: 'Unauthorized' });
      const roomData = activeRooms.get(meetingId);
      if (roomData && roomData.participants.has(targetSocketId)) {
        socket.to(targetSocketId).emit('host-removed-you');
      }
    });

    socket.on('host-end-meeting', async ({ meetingId }) => {
      if (!verifyHost(socket, meetingId)) return socket.emit('room-error', { message: 'Unauthorized' });
      socket.to(meetingId).emit('meeting-ended');
      
      // Update DB
      try {
        const meeting = await Meeting.findOne({ meetingId });
        if (meeting) {
          meeting.status = 'ended';
          meeting.endedAt = new Date();
          meeting.duration = Math.floor((meeting.endedAt - meeting.createdAt) / 1000);
          await meeting.save();
        }
      } catch(err) {
        console.error("Error ending meeting DB record:", err.message);
      }

      activeRooms.delete(meetingId);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      handleLeaveRoom(socket);
    });
  });
};

const handleLeaveRoom = async (socket) => {
  const meetingId = socket.meetingId;
  if (!meetingId) return;

  const roomData = activeRooms.get(meetingId);
  if (roomData && roomData.participants.has(socket.id)) {
    const participant = roomData.participants.get(socket.id);
    roomData.participants.delete(socket.id);
    socket.leave(meetingId);

    console.log(`User ${participant.name} (${socket.id}) left meeting room: ${meetingId}`);

    // Update Participant Leave Time in DB
    if (participant.dbId) {
      try {
        const pRecord = await MeetingParticipant.findById(participant.dbId);
        if (pRecord) {
          pRecord.leaveTime = new Date();
          pRecord.duration = Math.floor((pRecord.leaveTime - pRecord.joinTime) / 1000);
          await pRecord.save();
        }
      } catch(err) {
        console.error("Error updating participant leave time:", err.message);
      }
    }

    socket.to(meetingId).emit('participant-left', {
      socketId: socket.id,
      userId: participant.userId
    });

    if (roomData.participants.size === 0) {
      // If room is empty, mark meeting as ended in DB so it moves to History
      if (roomData.dbId) {
        try {
          const meeting = await Meeting.findById(roomData.dbId);
          if (meeting && meeting.status !== 'ended') {
            meeting.status = 'ended';
            meeting.endedAt = new Date();
            meeting.duration = Math.floor((meeting.endedAt - meeting.createdAt) / 1000);
            await meeting.save();
          }
        } catch(err) {
          console.error("Error auto-ending meeting when empty:", err.message);
        }
      }
      activeRooms.delete(meetingId);
    }
  }
  socket.meetingId = null;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initializeSocket, getIo };
