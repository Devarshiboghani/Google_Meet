import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Play, Copy, Loader2, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllActive, setShowAllActive] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        const res = await axios.get(`${backendUrl}/api/meetings/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setMeetings(res.data.meetings);
        }
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleCopyLink = (meetingId) => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
    alert('Meeting link copied to clipboard!');
  };

  const handleJoin = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const activeMeetings = meetings.filter(m => m.status === 'active');
  const pastMeetings = meetings.filter(m => m.status === 'ended');

  const displayedActive = showAllActive ? activeMeetings : activeMeetings.slice(0, 3);
  const displayedHistory = showAllHistory ? pastMeetings : pastMeetings.slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Active / Ongoing Meetings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Video className="w-5 h-5 mr-2 text-blue-400" />
            Active Meetings
          </h2>
          {activeMeetings.length > 3 && (
            <button 
              onClick={() => setShowAllActive(!showAllActive)}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              {showAllActive ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {displayedActive.length === 0 ? (
            <div className="text-slate-500 text-sm p-4 bg-slate-800/20 rounded-xl border border-slate-800">
              No active meetings right now.
            </div>
          ) : (
            displayedActive.map((meeting) => (
              <div key={meeting._id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-colors flex items-center justify-between group">
                <div className="flex items-start space-x-4">
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center flex-shrink-0 mt-1">
                    <Video className="w-4 h-4 text-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200 mb-1">{meeting.meetingId}</h4>
                    <div className="flex flex-wrap items-center text-xs text-slate-400 gap-x-3 gap-y-1">
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Started {formatTime(meeting.createdAt)}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-emerald-400 font-medium">Ongoing</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleJoin(meeting.meetingId)}
                    className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" 
                    title="Join Meeting"
                  >
                    <Play className="w-4 h-4 fill-emerald-400/20" />
                  </button>
                  <button 
                    onClick={() => handleCopyLink(meeting.meetingId)}
                    className="p-2 text-slate-400 hover:bg-slate-700 rounded-lg transition-colors" 
                    title="Copy Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Meeting History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            <History className="w-5 h-5 mr-2 text-purple-400" />
            Meeting History
          </h2>
          {pastMeetings.length > 3 && (
            <button 
              onClick={() => setShowAllHistory(!showAllHistory)}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              {showAllHistory ? 'Show Less' : 'View History'}
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {displayedHistory.length === 0 ? (
            <div className="text-slate-500 text-sm p-4 bg-slate-800/20 rounded-xl border border-slate-800">
              No meeting history found.
            </div>
          ) : (
            displayedHistory.map((meeting) => (
              <div key={meeting._id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-colors flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-700 items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200 mb-1">{meeting.meetingId}</h4>
                    <div className="flex flex-wrap items-center text-xs text-slate-400 gap-x-3 gap-y-1">
                      <span>{formatDate(meeting.createdAt)}</span>
                      <span className="text-slate-600">•</span>
                      <span>Ended at {formatTime(meeting.endedAt || meeting.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingList;
