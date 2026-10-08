import { useEffect, useState, useCallback } from 'react';
import { socket, connectSocket, disconnectSocket } from '../services/socket';

export const useMeetingSocket = (meetingId, user, isReady = true) => {
  const [participants, setParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [error, setError] = useState(null);
  const [mediaStates, setMediaStates] = useState({});
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isReady) return;

    connectSocket();

    const onConnect = () => {
      setIsConnected(true);
      setError(null);
      
      socket.emit('join-meeting', { meetingId, user });
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onParticipantsList = (list) => {
      setParticipants(list);
    };

    const onParticipantJoined = (participant) => {
      setParticipants((prev) => [...prev, participant]);
    };

    const onParticipantLeft = ({ socketId }) => {
      setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
    };

    const onRoomError = ({ message }) => {
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

      if (isRaised && userName) {
        const notif = { id: Date.now(), text: `${userName} raised their hand` };
        setNotifications(prev => [...prev, notif]);
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notif.id));
        }, 3000);
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('participants-list', onParticipantsList);
    socket.on('participant-joined', onParticipantJoined);
    socket.on('participant-left', onParticipantLeft);
    socket.on('room-error', onRoomError);
    socket.on('participant-media-changed', onParticipantMediaChanged);
    socket.on('receive-message', onReceiveMessage);
    socket.on('participant-hand-status', onParticipantHandStatus);

    if (socket.connected) {
      onConnect();
    }

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
  }, [meetingId, user, isReady]); 

  const leaveMeeting = useCallback(() => {
    socket.emit('leave-meeting');
    disconnectSocket();
  }, []);

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
      messageData.file = content;
    }

    setMessages(prev => [...prev, messageData]);
    
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
