import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Plus, Link as LinkIcon, Users } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();
  const [joinId, setJoinId] = useState('');

  const generateMeetingId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const getGroup = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${getGroup(3)}-${getGroup(4)}-${getGroup(3)}`;
  };

  const handleStartNewMeeting = () => {
    const newId = generateMeetingId();
    navigate(`/meeting/${newId}`);
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (joinId.trim()) {
      // Basic format cleanup
      const cleanId = joinId.trim().replace(/[^a-z0-9-]/gi, '').toLowerCase();
      navigate(`/meeting/${cleanId}`);
    }
  };

  const handleScheduleMeeting = () => {
    const newId = generateMeetingId();
    const meetingLink = `${window.location.origin}/meeting/${newId}`;
    
    // Construct Google Calendar URL
    const baseUrl = 'https://calendar.google.com/calendar/r/eventedit';
    const params = new URLSearchParams({
      text: 'Video Conference Meeting',
      details: `Join the video meeting here:\n${meetingLink}`,
      location: meetingLink
    });
    
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Start New Meeting Card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between hover:bg-slate-800 transition-colors group">
        <div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Video className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">New Meeting</h3>
          <p className="text-sm text-slate-400 mb-6">Start an instant meeting and invite others to join.</p>
        </div>
        <button 
          onClick={handleStartNewMeeting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Start Meeting
        </button>
      </div>

      {/* Join Meeting Card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between hover:bg-slate-800 transition-colors group">
        <div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Join Meeting</h3>
          <p className="text-sm text-slate-400 mb-6">Enter a meeting code or link to join an existing room.</p>
        </div>
        <form onSubmit={handleJoinMeeting} className="flex space-x-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              placeholder="e.g. abc-defg-hij" 
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-600"
            />
          </div>
          <button 
            type="submit"
            disabled={!joinId.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            Join
          </button>
        </form>
      </div>

      {/* Schedule Meeting Card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between hover:bg-slate-800 transition-colors group">
        <div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Schedule</h3>
          <p className="text-sm text-slate-400 mb-6">Plan ahead and schedule a meeting for later.</p>
        </div>
        <button 
          onClick={handleScheduleMeeting}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center border border-slate-600"
        >
          <Calendar className="h-4 w-4 mr-2 text-slate-300" />
          Schedule
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
