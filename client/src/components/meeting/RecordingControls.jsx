import React, { useState, useRef, useEffect } from 'react';
import { Circle, Square, Download, Loader2, CloudUpload } from 'lucide-react';
import { useParams } from 'react-router-dom';

const RecordingControls = () => {
  const { id: meetingId } = useParams();
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, stopping, completed
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [recordingState]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    try {
      // Capture screen with tab audio (remote voices)
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { displaySurface: 'browser' },
        audio: true 
      });

      // Capture local microphone
      let voiceStream = null;
      try {
        voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        console.warn("Could not capture local microphone for recording", e);
      }
      
      const tracks = [...displayStream.getVideoTracks()];

      // Merge audio tracks if available
      const audioContext = new AudioContext();
      const audioDestination = audioContext.createMediaStreamDestination();
      let hasAudio = false;

      if (displayStream.getAudioTracks().length > 0) {
        const displayAudioSource = audioContext.createMediaStreamSource(new MediaStream([displayStream.getAudioTracks()[0]]));
        displayAudioSource.connect(audioDestination);
        hasAudio = true;
      }

      if (voiceStream && voiceStream.getAudioTracks().length > 0) {
        const voiceAudioSource = audioContext.createMediaStreamSource(new MediaStream([voiceStream.getAudioTracks()[0]]));
        voiceAudioSource.connect(audioDestination);
        hasAudio = true;
      }

      if (hasAudio) {
        tracks.push(audioDestination.stream.getAudioTracks()[0]);
      }

      const stream = new MediaStream(tracks);
      streamRef.current = stream;

      // Keep references to original streams to stop them later
      stream.originalStreams = [displayStream];
      if (voiceStream) stream.originalStreams.push(voiceStream);

      // Handle user stopping the share natively via browser bar
      displayStream.getVideoTracks()[0].onended = () => {
        if (recordingState === 'recording') {
          stopRecording();
        }
      };

      const types = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      
      let options = {};
      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          options = { mimeType: type };
          break;
        }
      }
      
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      mediaRecorderRef.current.extension = options.mimeType?.includes('mp4') ? 'mp4' : 'webm';
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const type = mediaRecorderRef.current?.mimeType || 'video/webm';
        const blob = new Blob(chunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setRecordingState('completed');
        
        // Clean up tracks
        if (streamRef.current && streamRef.current.originalStreams) {
          streamRef.current.originalStreams.forEach(s => s.getTracks().forEach(track => track.stop()));
        }
      };

      recorder.start(1000); // collect 1 sec chunks
      setRecordingState('recording');
      setRecordingDuration(0);
      setDownloadUrl(null);

    } catch (err) {
      console.error("Recording error:", err);
      alert("Failed to start recording. Please ensure you grant screen and audio permissions.");
      setRecordingState('idle');
    }
  };

  const stopRecording = () => {
    setRecordingState('stopping');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const ext = mediaRecorderRef.current?.extension || 'webm';
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = `meeting-recording-${new Date().getTime()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleCloudUpload = async () => {
    if (!downloadUrl) return;
    setIsUploading(true);
    try {
      const type = mediaRecorderRef.current?.mimeType || 'video/webm';
      const ext = mediaRecorderRef.current?.extension || 'webm';
      const blob = new Blob(chunksRef.current, { type });
      const file = new File([blob], `recording-${meetingId}-${Date.now()}.${ext}`, { type });
      
      const formData = new FormData();
      formData.append('file', file);
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const uploadRes = await fetch(`${backendUrl}/api/files/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      if (uploadData.success) {
        await fetch(`${backendUrl}/api/meetings/${meetingId}/recordings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileUrl: uploadData.file.fileUrl,
            size: uploadData.file.fileSize,
            duration: recordingDuration
          })
        });
        alert("Recording saved to cloud successfully!");
        setRecordingState('idle');
      } else {
        alert("Upload failed: " + (uploadData.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error saving recording online.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetRecording = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    setRecordingDuration(0);
    setRecordingState('idle');
  };

  // Clean up Object URL on unmount
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      if (streamRef.current && streamRef.current.originalStreams) {
        streamRef.current.originalStreams.forEach(s => s.getTracks().forEach(track => track.stop()));
      }
    };
  }, [downloadUrl]);

  return (
    <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-800">
      
      {/* Recording Indicator */}
      {recordingState === 'recording' && (
        <div className="flex items-center space-x-2 mr-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
          <span className="text-sm font-medium text-rose-500 w-12">{formatTime(recordingDuration)}</span>
        </div>
      )}

      {recordingState === 'stopping' && (
        <div className="flex items-center space-x-2 mr-2 text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Saving...</span>
        </div>
      )}

      {/* Action Buttons */}
      {recordingState === 'idle' && (
        <button 
          onClick={startRecording}
          title="Start Recording"
          className="flex items-center space-x-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors"
        >
          <Circle className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="text-sm font-medium">Record</span>
        </button>
      )}

      {recordingState === 'recording' && (
        <button 
          onClick={stopRecording}
          title="Stop Recording"
          className="flex items-center space-x-1.5 text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded transition-colors"
        >
          <Square className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">Stop</span>
        </button>
      )}

      {recordingState === 'completed' && (
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCloudUpload}
            disabled={isUploading}
            title="Save to Cloud"
            className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
            <span className="text-sm font-medium">{isUploading ? 'Saving...' : 'Save Online'}</span>
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={isUploading}
            title="Download Local Copy"
            className="flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download Local</span>
          </button>
          
          <button 
            onClick={resetRecording}
            disabled={isUploading}
            className="text-xs text-slate-400 hover:text-slate-300 underline disabled:opacity-50"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
