import React from 'react';
import { MicOff, VideoOff, Mic, Hand, Pin, PinOff } from 'lucide-react';

const VideoTile = ({ name, isLocal, mediaState, isPinned, onPin, children }) => {
  const isAudioOff = mediaState && mediaState.audio === false;
  const isVideoOff = mediaState && mediaState.video === false;

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl group flex items-center justify-center">
      {/* Actual Video Content */}
      <div className={`absolute inset-0 w-full h-full ${isVideoOff ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        {children}
      </div>

      {/* Fallback UI when Camera is Off */}
      {isVideoOff && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg border-2 border-slate-700">
            {name.charAt(0)}
          </div>
        </div>
      )}

      {/* Name and Status Badges */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center space-x-2 z-20 shadow-lg">
        <span className="text-sm font-medium text-white">
          {name} {isLocal ? '(You)' : ''} 
          {mediaState?.screen && <span className="ml-1 text-blue-400 font-bold">(Presenting)</span>}
        </span>
        {isAudioOff && (
          <span className="bg-rose-500/20 p-1 rounded border border-rose-500/30">
            <MicOff className="w-3 h-3 text-rose-500" />
          </span>
        )}
      </div>

      {/* Speaker Indicator (Simple visual flare) */}
      {!isAudioOff && !mediaState?.hand && (
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/50 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Mic className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      {/* Hand Raised Indicator */}
      {mediaState?.hand && (
        <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md p-2 rounded-lg border border-amber-400 z-30 shadow-lg shadow-amber-500/20 animate-bounce">
          <Hand className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Pin Button */}
      {onPin && (
        <button 
          onClick={onPin}
          className={`absolute top-4 left-4 p-2 rounded-lg border z-30 transition-all ${isPinned ? 'bg-blue-600/90 border-blue-500 text-white opacity-100' : 'bg-slate-900/80 border-slate-700/50 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-800'}`}
        >
          {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};

export default VideoTile;
