import { useState, useEffect, useRef } from 'react';

export const useMediaStream = (audio = true, video = true) => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const cameraTrackRef = useRef(null);
  const screenTrackRef = useRef(null);

  useEffect(() => {
    let currentStream = null;

    const startStream = async () => {
      try {
        setIsLoading(true);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio,
          video
        });
        currentStream = mediaStream;
        
        cameraTrackRef.current = mediaStream.getVideoTracks()[0];
        
        setStream(mediaStream);
        setError(null);
      } catch (err) {
        console.error("Error accessing media devices.", err);
        if (err.name === 'NotAllowedError') {
          setError('Camera and Microphone access was denied. Please allow access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera or microphone found on this device.');
        } else {
          setError('An error occurred while accessing media devices.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    startStream();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
      }
    };
  }, [audio, video]);

  const toggleAudio = (forceState) => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = forceState !== undefined ? forceState : !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  };

  const toggleVideo = (forceState) => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = forceState !== undefined ? forceState : !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  };


  const startScreenShare = async (replaceVideoTrackCallback) => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = displayStream.getVideoTracks()[0];
      screenTrackRef.current = screenTrack;

      screenTrack.onended = () => {
        stopScreenShare(replaceVideoTrackCallback);
      };

      if (replaceVideoTrackCallback) {
        await replaceVideoTrackCallback(screenTrack);
      }

      if (stream) {
        stream.removeTrack(stream.getVideoTracks()[0]);
        stream.addTrack(screenTrack);
      }

      setIsScreenSharing(true);
    } catch (err) {
      console.error("Screen sharing cancelled or failed:", err);
    }
  };

  const stopScreenShare = async (replaceVideoTrackCallback) => {
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }

    if (cameraTrackRef.current && stream) {
      if (replaceVideoTrackCallback) {
        await replaceVideoTrackCallback(cameraTrackRef.current);
      }

      stream.removeTrack(stream.getVideoTracks()[0]);
      stream.addTrack(cameraTrackRef.current);
    }

    setIsScreenSharing(false);
  };

  return { 
    stream, 
    error, 
    isLoading, 
    toggleAudio, 
    toggleVideo,
    isScreenSharing,
    startScreenShare,
    stopScreenShare
  };
};
