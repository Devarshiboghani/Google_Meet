import { useEffect, useRef, useState, useCallback } from 'react';
import { socket } from '../services/socket';

export const useWebRTC = (localStream, isConnected) => {
  const peersRef = useRef({}); // Store all active RTCPeerConnections mapped by socket ID
  const [remoteStreams, setRemoteStreams] = useState({});

  const createPeer = useCallback((targetSocketId) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
      });
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-ice-candidate', {
          to: targetSocketId,
          candidate: event.candidate
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [targetSocketId]: event.streams[0]
      }));
    };

    peer.oniceconnectionstatechange = () => {
      const state = peer.iceConnectionState;
      if (state === 'failed' || state === 'disconnected' || state === 'closed') {
        peer.close();
        delete peersRef.current[targetSocketId];
        setRemoteStreams(prev => {
          const newStreams = { ...prev };
          delete newStreams[targetSocketId];
          return newStreams;
        });
      }
    };

    return peer;
  }, [localStream]);

  useEffect(() => {
    if (!localStream || !isConnected) return;

    const handleParticipantJoined = async (participant) => {
      const targetId = participant.socketId;
      const peer = createPeer(targetId);
      peersRef.current[targetId] = peer;

      try {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer); // Set our own SDP
        socket.emit('webrtc-offer', { to: targetId, offer }); // Send SDP
      } catch (err) {
        console.error('Error creating WebRTC offer:', err);
      }
    };

    const handleOffer = async ({ offer, from }) => {
      const peer = createPeer(from);
      peersRef.current[from] = peer;

      try {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit('webrtc-answer', { to: from, answer });
      } catch (err) {
        console.error('Error handling WebRTC offer:', err);
      }
    };

    const handleAnswer = async ({ answer, from }) => {
      const peer = peersRef.current[from];
      if (peer) {
        try {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error('Error setting WebRTC answer:', err);
        }
      }
    };

    const handleIceCandidate = async ({ candidate, from }) => {
      const peer = peersRef.current[from];
      if (peer) {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    };

    // Handle sudden disconnects
    const handleParticipantLeft = ({ socketId }) => {
      const peer = peersRef.current[socketId];
      if (peer) {
        peer.close();
        delete peersRef.current[socketId];
      }
      setRemoteStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[socketId];
        return newStreams;
      });
    };

    // Attach signaling listeners
    socket.on('participant-joined', handleParticipantJoined);
    socket.on('webrtc-offer', handleOffer);
    socket.on('webrtc-answer', handleAnswer);
    socket.on('webrtc-ice-candidate', handleIceCandidate);
    socket.on('participant-left', handleParticipantLeft); 

    // Cleanup listeners when unmounting
    return () => {
      socket.off('participant-joined', handleParticipantJoined);
      socket.off('webrtc-offer', handleOffer);
      socket.off('webrtc-answer', handleAnswer);
      socket.off('webrtc-ice-candidate', handleIceCandidate);
      socket.off('participant-left', handleParticipantLeft);
    };
  }, [localStream, isConnected, createPeer]);

  useEffect(() => {
    return () => {
      Object.values(peersRef.current).forEach(peer => peer.close());
      peersRef.current = {};
    };
  }, []);

  const replaceVideoTrack = useCallback(async (newVideoTrack) => {
    Object.values(peersRef.current).forEach(async (peer) => {
      const sender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender && newVideoTrack) {
        try {
          await sender.replaceTrack(newVideoTrack);
        } catch (err) {
          console.error("Failed to replace video track:", err);
        }
      }
    });
  }, []);

  return { remoteStreams, replaceVideoTrack };
};
