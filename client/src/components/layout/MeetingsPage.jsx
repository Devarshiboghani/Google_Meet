import React from 'react';
import DashboardLayout from './DashboardLayout';
import MeetingList from '../dashboard/MeetingList';

const MeetingsPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">My Meetings</h1>
        <p className="text-slate-400">View and manage all your active and past meetings.</p>
      </div>
      <MeetingList />
    </DashboardLayout>
  );
};

export default MeetingsPage;
