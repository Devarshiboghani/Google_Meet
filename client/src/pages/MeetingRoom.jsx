import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, PhoneOff, Video as VideoIcon, VideoOff, 
  Mic, MicOff, AlertCircle, MonitorUp, Hand, 
  MessageSquare, Info, MoreVertical, X, Settings
} from 'lucide-react';
import { useMeetingSocket } from '../hooks/useMeetingSocket';
import { useMediaStream } from '../hooks/useMediaStream';
import { useWebRTC } from '../hooks/useWebRTC';
import { socket } from '../services/socket';
import VideoGrid from '../components/meeting/VideoGrid';
import ChatPanel from '../components/meeting/ChatPanel';
import ParticipantsPanel from '../components/meeting/ParticipantsPanel';
import RecordingControls from '../components/meeting/RecordingControls';
import PreJoinScreen from '../components/meeting/PreJoinScreen';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import { useAuth } from '../context/AuthContext';
import { Copy, Link2, Maximize, Minimize } from 'lucide-react';

const MeetingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const currentUser = useMemo(() => {
    return user || { id: `guest-${Math.floor(Math.random()*1000)}`, name: 'Guest User' };
  }, [user]);

  // WebRTC & Hardware
  const { 
    stream, 
    error: mediaError, 
    toggleAudio, 
    toggleVideo,
    isScreenSharing,
    startScreenShare,
    stopScreenShare
  } = useMediaStream(true, true);
  const isReadyToJoin = stream !== null;
  // UI State
  const [hasJoined, setHasJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // 'participants' | 'chat' | null
  const [systemAlert, setSystemAlert] = useState(null); // Used for host alerts
  const [isFullscreen, setIsFullscreen] = useState(false);

  const actuallyReadyToJoin = isReadyToJoin && hasJoined;

  const { 
    participants, 
    isConnected, 
    error: socketError, 
    leaveMeeting,
    mediaStates,
    toggleRemoteMedia,
    messages,
    sendMessage,
    raiseHand,
    lowerHand,
    notifications
  } = useMeetingSocket(id, currentUser, actuallyReadyToJoin);
  
  const { remoteStreams, replaceVideoTrack } = useWebRTC(stream, isConnected);

  const currentUserHost = currentUser.id === id; 

  // Show a toast notification helper
  const [notificationsState, setNotificationsState] = useState([]);
  
  const showToast = (text) => {
    const notif = { id: Date.now(), text };
    setNotificationsState(prev => [...prev, notif]);
    setTimeout(() => {
      setNotificationsState(prev => prev.filter(n => n.id !== notif.id));
    }, 3000);
  };
  
  const combinedNotifications = [...notifications, ...notificationsState];

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; 
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    socket.on('host-muted-you', () => {
      toggleAudio(false); 
      setIsMuted(true);   
      toggleRemoteMedia(id, 'audio', false); 
      setSystemAlert("The host has muted your microphone.");
    });

    socket.on('host-removed-you', () => {
      setSystemAlert("You have been removed from the meeting by the host.");
      setTimeout(() => {
        handleLeave();
      }, 3000);
    });

    socket.on('meeting-ended', () => {
      setSystemAlert("The host has ended the meeting for everyone.");
      setTimeout(() => {
        handleLeave();
      }, 3000);
    });

    return () => {
      socket.off('host-muted-you');
      socket.off('host-removed-you');
      socket.off('meeting-ended');
    };
  }, [id, toggleAudio, toggleRemoteMedia]);

  useEffect(() => {
    if (isConnected && hasJoined) {
      toggleRemoteMedia(id, 'audio', !isMuted);
      toggleRemoteMedia(id, 'video', !isVideoOff);
    }
  }, [isConnected, hasJoined]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (hasJoined) {
      socket.emit('create-meeting', { meetingId: id, hostId: currentUser.id });
      const timer = setInterval(() => setCurrentTime(new Date()), 60000);
      return () => clearInterval(timer);
    }
  }, [id, currentUser.id, hasJoined]);

  const handleLeave = () => {
    leaveMeeting();
    navigate('/dashboard');
  };

  const handleToggleMic = () => {
    const isEnabled = toggleAudio();
    setIsMuted(!isEnabled);
    toggleRemoteMedia(id, 'audio', isEnabled);
  };

  const handleToggleCamera = () => {
    const isEnabled = toggleVideo();
    setIsVideoOff(!isEnabled);
    toggleRemoteMedia(id, 'video', isEnabled);
  };

  const togglePanel = (panelName) => {
    setActivePanel(prev => prev === panelName ? null : panelName);
  };

  const handleToggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        stopScreenShare(replaceVideoTrack);
        toggleRemoteMedia(id, 'screen', false);
      } else {
        await startScreenShare(replaceVideoTrack);
        toggleRemoteMedia(id, 'screen', true);
      }
    } catch (err) {
      showToast("Could not access screen share permissions.");
    }
  };

  const handleToggleHand = () => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    if (newState) {
      raiseHand(id, currentUser.name);
    } else {
      lowerHand(id);
    }
  };

  const handleSendMessage = (content, type = 'text') => {
    sendMessage(id, currentUser.id, currentUser.name, content, type);
  };

  const handleMuteParticipant = (targetSocketId) => {
    if (window.confirm("Are you sure you want to mute this participant?")) {
      hostMuteParticipant(id, targetSocketId);
    }
  };

  const handleRemoveParticipant = (targetSocketId) => {
    if (window.confirm("Are you sure you want to remove this participant from the meeting?")) {
      hostRemoveParticipant(id, targetSocketId);
    }
  };

  const handleEndMeeting = () => {
    if (window.confirm("Are you sure you want to end the meeting for EVERYONE?")) {
      hostEndMeeting(id);
      handleLeave();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        showToast("Fullscreen is not supported by your browser");
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const copyMeetingId = () => {
    navigator.clipboard.writeText(id);
    showToast("Meeting ID copied to clipboard!");
  };

  const copyMeetingLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    showToast("Meeting link copied to clipboard!");
  };

  // Setup Keyboard Shortcuts
  useKeyboardShortcuts({
    toggleMicrophone: handleToggleMic,
    toggleCamera: handleToggleCamera,
    toggleScreenShare: handleToggleScreenShare,
    toggleChat: () => setActivePanel(prev => prev === 'chat' ? null : 'chat'),
    toggleParticipants: () => setActivePanel(prev => prev === 'participants' ? null : 'participants')
  });

  const error = socketError || mediaError;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Permission Error</h1>
        <p className="text-slate-400 mb-6 text-center max-w-md">{error}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-slate-800 hover:bg-slate-700 px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Retry
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <PreJoinScreen 
        stream={stream}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        toggleMic={handleToggleMic}
        toggleCamera={handleToggleCamera}
        onJoin={() => setHasJoined(true)}
        meetingId={id}
      />
    );
  }

  const remoteParticipants = participants.filter(p => p.socketId !== socket.id);
  const localMediaState = { audio: !isMuted, video: !isVideoOff, screen: isScreenSharing, hand: isHandRaised };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      
      {/* System Alert Overlay */}
      {systemAlert && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Notice</h2>
            <p className="text-slate-300 mb-6">{systemAlert}</p>
            <button 
              onClick={() => setSystemAlert(null)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-medium transition-colors w-full"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="h-14 flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-800">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
          <span className="text-sm font-semibold text-slate-300 tracking-wider">
            {isConnected ? 'SECURE CONNECTION' : 'CONNECTING...'}
          </span>
          <div className="h-4 w-px bg-slate-700 mx-2"></div>
          <button onClick={copyMeetingId} className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors group" title="Copy Meeting ID">
            <span>{id}</span>
            <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
          </button>
          <button onClick={copyMeetingLink} className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors group ml-2" title="Copy Meeting Link">
            <Link2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Copy Link</span>
          </button>
        </div>

        <RecordingControls />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Toast Notifications Overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col space-y-2 pointer-events-none">
          {combinedNotifications.map(notif => (
            <div key={notif.id} className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce">
              <span className="text-sm font-medium tracking-wide">{notif.text}</span>
            </div>
          ))}
        </div>

        {/* Video Grid Section */}
        <div className="flex-1 flex p-2 md:p-4 min-w-0 transition-all duration-300">
          <div className="w-full h-full bg-slate-900/50 rounded-3xl overflow-hidden border border-slate-800/50 flex">
            <VideoGrid 
              localStream={stream}
              remoteStreams={remoteStreams}
              remoteParticipants={remoteParticipants}
              localName={currentUser.name}
              localMediaState={localMediaState}
              remoteMediaStates={mediaStates}
            />
          </div>
        </div>

        {/* Right Sidebar Panel */}
        <div 
          className={`
            bg-slate-900 border-l border-slate-800 flex flex-col transition-all duration-300 ease-in-out
            absolute md:relative right-0 h-full z-30
            ${activePanel ? 'w-full md:w-[360px] translate-x-0 opacity-100' : 'w-0 translate-x-full opacity-0 border-none'}
          `}
        >
          {/* Prevent inner content from squishing during width transition */}
          <div className="w-full md:w-[360px] h-full flex flex-col min-w-[320px]">
            {/* Panel Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
              <h2 className="text-lg font-semibold capitalize">{activePanel}</h2>
              <button 
                onClick={() => setActivePanel(null)} 
                className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Content: Participants */}
            {activePanel === 'participants' && (
              <ParticipantsPanel 
                participants={participants}
                mediaStates={mediaStates}
                currentSocketId={socket.id}
                localMediaState={localMediaState}
                currentUserHost={currentUserHost}
                onMuteParticipant={handleMuteParticipant}
                onRemoveParticipant={handleRemoveParticipant}
              />
            )}

            {/* Panel Content: Chat */}
            {activePanel === 'chat' && (
              <ChatPanel 
                messages={messages} 
                currentUserId={currentUser.id} 
                onSendMessage={handleSendMessage} 
              />
            )}
          </div>
        </div>
      </main>

      {/* Bottom Control Bar */}
      <footer className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 md:px-6 z-20 shrink-0">
        
        {/* Left: Meeting Info */}
        <div className="w-1/3 text-sm text-slate-400 font-medium hidden md:flex items-center space-x-4">
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="w-px h-4 bg-slate-700"></span>
          <span className="truncate pr-4">{id}</span>
        </div>

        {/* Center: Main Controls */}
        <div className="w-full md:w-1/3 flex items-center justify-center space-x-3">
          <button 
            onClick={handleToggleMic}
            title="Toggle Microphone"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${isMuted ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-105'}`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={handleToggleCamera}
            title="Toggle Camera"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${isVideoOff ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-105'}`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          <button 
            onClick={handleToggleScreenShare}
            title={isScreenSharing ? "Stop Presenting" : "Present Now"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-105 ${isScreenSharing ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          <button 
            onClick={handleToggleHand}
            title={isHandRaised ? "Lower Hand" : "Raise Hand"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg ${isHandRaised ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Hand className="w-5 h-5" />
          </button>

          <button 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 items-center justify-center transition-all hidden sm:flex hover:scale-105"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          {/* End Meeting / Leave Button Split */}
          {currentUserHost ? (
            <div className="flex bg-rose-600 rounded-full shadow-lg shadow-rose-600/20 ml-2">
              <button 
                onClick={handleLeave}
                title="Leave Meeting"
                className="px-5 h-12 rounded-l-full hover:bg-rose-500 text-white font-medium flex items-center justify-center transition-colors border-r border-rose-700/50"
              >
                <PhoneOff className="w-5 h-5 mr-0 md:mr-2" />
                <span className="hidden md:block">Leave</span>
              </button>
              <button 
                onClick={handleEndMeeting}
                title="End Meeting for All"
                className="px-4 h-12 rounded-r-full hover:bg-rose-500 text-white font-medium flex items-center justify-center transition-colors"
              >
                <span className="hidden md:block">End for All</span>
                <span className="md:hidden">End</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLeave}
              title="Leave Meeting"
              className="px-6 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center justify-center transition-all shadow-lg shadow-rose-600/20 ml-2 hover:scale-105"
            >
              <PhoneOff className="w-5 h-5 mr-0 md:mr-2" />
              <span className="hidden md:block">Leave Call</span>
            </button>
          )}
        </div>

        {/* Right: Auxiliary Toggles */}
        <div className="w-1/3 hidden sm:flex items-center justify-end space-x-2">
          <button title="Meeting Details" className="w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
            <Info className="w-5 h-5" />
          </button>
          <button 
            onClick={() => togglePanel('participants')} 
            title="Participants"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${activePanel === 'participants' ? 'bg-blue-600/20 text-blue-500' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Users className="w-5 h-5" />
            {participants.length > 1 && (
              <span className="absolute -top-1 -right-1 bg-slate-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900">
                {participants.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => togglePanel('chat')} 
            title="Chat"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${activePanel === 'chat' ? 'bg-blue-600/20 text-blue-500' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button title="Settings" className="w-10 h-10 hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors ml-2 border-l border-slate-700 pl-4 rounded-none">
            <Settings className="w-5 h-5 ml-2" />
          </button>
        </div>
        
        {/* Mobile Auxiliary (Stacked tight) */}
        <div className="sm:hidden flex space-x-2">
          <button onClick={() => togglePanel('participants')} className="text-slate-400">
            <Users className="w-5 h-5" />
          </button>
          <button onClick={() => togglePanel('chat')} className="text-slate-400">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MeetingRoom;
