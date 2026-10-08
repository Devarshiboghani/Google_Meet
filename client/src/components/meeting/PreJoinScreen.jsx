import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, Settings, Check } from 'lucide-react';

const PreJoinScreen = ({ stream, isMuted, isVideoOff, toggleMic, toggleCamera, onJoin, meetingId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 md:p-8">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-slate-100">Google Meet Clone</h1>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <span>{meetingId}</span>
        </div>
      </div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-16">
        
        {/* Left Side: Video Preview */}
        <div className="flex-1 w-full max-w-2xl flex flex-col">
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {stream && !isVideoOff ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                <VideoOff className="w-16 h-16 mb-4 opacity-50" />
                <p>Camera is off</p>
              </div>
            )}

            {/* Hardware Controls Overlay */}
            <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-4">
              <button 
                onClick={toggleMic}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg border border-slate-700/50 ${isMuted ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm text-white'}`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button 
                onClick={toggleCamera}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg border border-slate-700/50 ${isVideoOff ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm text-white'}`}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between px-2 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${stream ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              <span>{stream ? 'Hardware Ready' : 'Requesting Permissions...'}</span>
            </div>
            <button className="flex items-center hover:text-white transition-colors">
              <Settings className="w-4 h-4 mr-2" />
              Check audio & video
            </button>
          </div>
        </div>

        {/* Right Side: Join Actions */}
        <div className="w-full md:w-[380px] flex flex-col items-center text-center">
          <h2 className="text-3xl font-semibold mb-2">Ready to join?</h2>
          <p className="text-slate-400 mb-8">No one else is here yet</p>

          <button 
            onClick={onJoin}
            disabled={!stream}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-full py-3.5 px-8 font-medium text-lg transition-colors flex items-center justify-center shadow-lg shadow-blue-600/20"
          >
            <Check className="w-5 h-5 mr-2" />
            Join now
          </button>
          
          <button className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full py-3.5 px-8 font-medium transition-colors flex items-center justify-center">
            <MonitorUp className="w-5 h-5 mr-2" />
            Present
          </button>
          
          <div className="mt-8 text-sm text-slate-500">
            Other options
            <div className="mt-2 text-blue-400 hover:underline cursor-pointer">Join and use a phone for audio</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreJoinScreen;
