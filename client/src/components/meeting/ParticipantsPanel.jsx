import React from 'react';
import { Mic, MicOff, Video, VideoOff, Hand, Crown, X } from 'lucide-react';

const ParticipantsPanel = ({ 
  participants, 
  mediaStates, 
  currentSocketId, 
  localMediaState,
  currentUserHost,
  onMuteParticipant,
  onRemoveParticipant
}) => {
  // Sort participants so the current user is always at the top
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.socketId === currentSocketId) return -1;
    if (b.socketId === currentSocketId) return 1;
    return 0;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
      {sortedParticipants.map(p => {
        const isMe = p.socketId === currentSocketId;
        
        // Use local state if it's us, otherwise use the synced remote state
        const state = isMe ? localMediaState : (mediaStates[p.socketId] || { audio: true, video: true, hand: false });
        
        const isAudioOn = state.audio;
        const isVideoOn = state.video;
        const isHandRaised = state.hand;

        // Either we are the host, or the backend said they are the host
        const isHost = isMe ? currentUserHost : p.isHost;

        return (
          <div key={p.socketId} className="flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 p-3 rounded-xl border border-slate-700/50 transition-colors">
            {/* Left: Avatar & Info */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold shadow-lg text-white">
                  {p.name.charAt(0)}
                </div>
                {/* Connection Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-800 rounded-full"></div>
              </div>
              
              <div className="min-w-0 pr-2">
                <p className="text-sm font-medium truncate text-white flex items-center gap-1.5">
                  {p.name} {isMe && <span className="text-slate-400 font-normal">(You)</span>}
                  {isHost && (
                    <span title="Meeting Host" className="text-amber-400 bg-amber-400/10 rounded p-0.5 inline-flex">
                      <Crown className="w-3 h-3" />
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-emerald-400 font-medium">Connected</p>
              </div>
            </div>

              {/* Right: Status Icons & Host Controls */}
              <div className="flex items-center space-x-1.5 shrink-0">
                {isHandRaised && (
                  <div title="Hand Raised" className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 text-amber-400">
                    <Hand className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div title={isVideoOn ? "Camera On" : "Camera Off"} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${!isVideoOn ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-700/50 text-slate-300'}`}>
                  {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                </div>
                
                <div title={isAudioOn ? "Microphone On" : "Microphone Off"} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${!isAudioOn ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-700/50 text-slate-300'}`}>
                  {isAudioOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </div>

                {/* Host Controls */}
                {currentUserHost && !isMe && (
                  <div className="flex items-center space-x-1 ml-2 border-l border-slate-700 pl-2">
                    {isAudioOn && (
                      <button 
                        onClick={() => onMuteParticipant(p.socketId)}
                        title="Force Mute" 
                        className="w-7 h-7 rounded hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <MicOff className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button 
                      onClick={() => onRemoveParticipant(p.socketId)}
                      title="Remove Participant" 
                      className="w-7 h-7 rounded hover:bg-rose-500/20 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  export default ParticipantsPanel;
