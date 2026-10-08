import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { MessageSquare, Calendar, Loader2 } from 'lucide-react';
import axios from 'axios';

const MessagesPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await axios.get(`${backendUrl}/api/meetings/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setMeetings(res.data.meetings.filter(m => m.status === 'ended'));
        }
      } catch (err) {
        console.error("Failed to fetch meetings for messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Meeting Messages</h1>
        <p className="text-slate-400">View chat history from your past meetings.</p>
      </div>

      <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4 mb-8 flex items-start space-x-3">
        <MessageSquare className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-purple-200">
          <strong>Chat Archives:</strong> Select a past meeting to view its complete chat transcript and shared files. (Coming soon)
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meetings.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-slate-800/20 rounded-2xl border border-slate-700/50 text-slate-500">
              No past meetings found.
            </div>
          ) : (
            meetings.map(meeting => (
              <div key={meeting._id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <MessageSquare className="w-6 h-6 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <span className="text-xs text-slate-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(meeting.endedAt || meeting.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Meeting: {meeting.meetingId}</h3>
                <p className="text-sm text-slate-400">
                  Click to view chat transcript and shared messages from this session.
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MessagesPage;
