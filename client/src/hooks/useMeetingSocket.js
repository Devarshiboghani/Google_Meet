import { useEffect, useState, useCallback } from 'react';
import { socket, connectSocket, disconnectSocket } from '../services/socket';

/**
 * CUSTOM HOOK: useMeetingSocket
 * 
 * FLOW OF EVENTS:
 * 1. User A creates a meeting -> Navigates to /meeting/:id
 * 2. Component mounts -> useMeetingSocket is called
 * 3. We connect the socket to the backend.
 * 4. We emit 'join-meeting' with the meeting ID.
 * 5. Backend adds the socket to the room and emits 'participants-list' to User A.
 * 6. User B navigates to /meeting/:id
 * 7. User B connects and emits 'join-meeting'.
 * 8. Backend adds User B to the room, sends 'participants-list' to User B.
 * 9. Backend emits 'participant-joined' to User A (and anyone else in the room).
 * 10. If someone leaves, backend emits 'participant-left'.
 */
export const useMeetingSocket = (meetingId, user, isReady = true) => {
  const [participants, setParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [error, setError] = useState(null);
  const [mediaStates, setMediaStates] = useState({});
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only proceed to connect if the hardware (media stream) is ready
    if (!isReady) return;

    // 1. Establish connection when hook mounts
    connectSocket();

    // 2. Define Event Handlers
    const onConnect = () => {
      setIsConnected(true);
      setError(null);
      
      // When connected, attempt to join the specific meeting room
      socket.emit('join-meeting', { meetingId, user });
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onParticipantsList = (list) => {
      // Received when first joining the room. Contains everyone already in the room.
      setParticipants(list);
    };

    const onParticipantJoined = (participant) => {
      // Received when a NEW user joins the room you are already in.
      setParticipants((prev) => [...prev, participant]);
    };

    const onParticipantLeft = ({ socketId }) => {
      // Received when someone leaves the room.
      setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
    };

    const onRoomError = ({ message }) => {
      // Received if the meeting ID is invalid or full.
      setError(message);
    };

    const onParticipantMediaChanged = ({ socketId, type, isEnabled }) => {
      setMediaStates(prev => ({
        ...prev,
        [socketId]: {
          ...(prev[socketId] || { audio: true, video: true }),
          [type]: isEnabled
        }
      }));
    };

    const onReceiveMessage = (msgData) => {
      setMessages(prev => [...prev, msgData]);
    };

    const onParticipantHandStatus = ({ socketId, isRaised, userName }) => {
      setMediaStates(prev => ({
        ...prev,
        [socketId]: {
          ...(prev[socketId] || { audio: true, video: true }),
          hand: isRaised
        }
      }));

      // Show notification if someone raised their hand
      if (isRaised && userName) {
        const notif = { id: Date.now(), text: `${userName} raised their hand` };
        setNotifications(prev => [...prev, notif]);
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notif.id));
        }, 3000);
      }
    };

    // 3. Attach Listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('participants-list', onParticipantsList);
    socket.on('participant-joined', onParticipantJoined);
    socket.on('participant-left', onParticipantLeft);
    socket.on('room-error', onRoomError);
    socket.on('participant-media-changed', onParticipantMediaChanged);
    socket.on('receive-message', onReceiveMessage);
    socket.on('participant-hand-status', onParticipantHandStatus);

    // If socket is already connected when hook mounts (e.g. fast navigation),
    // trigger the join process manually since 'connect' won't fire again.
    if (socket.connected) {
      onConnect();
    }

    // 4. Cleanup (CRITICAL STEP)
    // When the component unmounts (e.g. user navigates away), we must remove listeners
    // to prevent duplicate event triggers, ghost participants, and memory leaks.
    return () => {
      socket.emit('leave-meeting');
      
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('participants-list', onParticipantsList);
      socket.off('participant-joined', onParticipantJoined);
      socket.off('participant-left', onParticipantLeft);
      socket.off('room-error', onRoomError);
      socket.off('participant-media-changed', onParticipantMediaChanged);
      socket.off('receive-message', onReceiveMessage);
      socket.off('participant-hand-status', onParticipantHandStatus);
      
      disconnectSocket();
    };
  }, [meetingId, user, isReady]); // Only re-run if the meetingId changes

  // Expose a function to explicitly leave the meeting via button click
  const leaveMeeting = useCallback(() => {
    socket.emit('leave-meeting');
    disconnectSocket();
  }, []);

  // Function to emit our media state changes to others
  const toggleRemoteMedia = useCallback((meetingId, type, isEnabled) => {
    socket.emit('toggle-media', { meetingId, type, isEnabled });
  }, []);

  // Function to send a chat message
  const sendMessage = useCallback((meetingId, senderId, senderName, content, type = 'text') => {
    const messageData = {
      meetingId,
      senderId,
      senderName,
      type,
      timestamp: new Date().toISOString()
    };
    
    if (type === 'text') {
      messageData.message = content;
    } else if (type === 'file') {
      // content is the file metadata object
      messageData.file = content;
    }

    // Add to our own state instantly
    setMessages(prev => [...prev, messageData]);
    
    // Broadcast to others
    socket.emit('send-message', messageData);
  }, []);

  const raiseHand = useCallback((meetingId, userName) => {
    socket.emit('raise-hand', { meetingId, userName });
  }, []);

  const lowerHand = useCallback((meetingId) => {
    socket.emit('lower-hand', { meetingId });
  }, []);

  // --- HOST CONTROLS ---
  const hostMuteParticipant = useCallback((meetingId, targetSocketId) => {
    socket.emit('host-mute-participant', { meetingId, targetSocketId });
  }, []);

  const hostRemoveParticipant = useCallback((meetingId, targetSocketId) => {
    socket.emit('host-remove-participant', { meetingId, targetSocketId });
  }, []);

  const hostEndMeeting = useCallback((meetingId) => {
    socket.emit('host-end-meeting', { meetingId });
  }, []);

  return {
    participants,
    isConnected,
    error,
    leaveMeeting,
    mediaStates,
    toggleRemoteMedia,
    messages,
    sendMessage,
    raiseHand,
    lowerHand,
    notifications,
    hostMuteParticipant,
    hostRemoveParticipant,
    hostEndMeeting
  };
};
