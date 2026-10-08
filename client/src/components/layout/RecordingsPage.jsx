import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Clock, Download, Video, Loader2 } from 'lucide-react';
import axios from 'axios';

const RecordingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await axios.get(`${backendUrl}/api/meetings/my-recordings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setMeetings(res.data.recordings);
        }
      } catch (err) {
        console.error("Failed to fetch cloud recordings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecordings();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">My Recordings</h1>
        <p className="text-slate-400">Manage your saved meeting recordings.</p>
      </div>
      
      <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 mb-8 flex items-start space-x-3">
        <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-200">
          <strong>Cloud Recordings:</strong> These are your recordings saved securely to the cloud. You can watch or download them at any time.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-slate-800/20 rounded-2xl border border-slate-700/50 text-slate-500">
              No cloud recordings found.
            </div>
          ) : (
            meetings.map(recording => (
              <div key={recording._id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 transition-colors flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-emerald-400" />
                  </div>
                  <a 
                    href={recording.fileUrl} 
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                    title="Download Video"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
                
                <h3 className="text-lg font-medium text-white mb-1">
                  Meeting: {recording.meeting?.meetingId || 'Unknown'}
                </h3>
                
                <p className="text-xs text-slate-400 mb-4 flex-1">
                  Recorded on: {new Date(recording.createdAt).toLocaleDateString()} at {new Date(recording.createdAt).toLocaleTimeString()}
                  <br/>
                  Duration: {recording.duration} seconds
                  <br/>
                  Size: {(recording.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                
                <a 
                  href={recording.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Play Recording
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default RecordingsPage;
