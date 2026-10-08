import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import QuickActions from '../components/dashboard/QuickActions';
import MeetingList from '../components/dashboard/MeetingList';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  // Get current hour to show contextual greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{greeting}, {user?.name ? user.name.split(' ')[0] : 'User'}!</h1>
        <p className="text-slate-400">Ready for your next meeting? You have 2 meetings scheduled for today.</p>
      </div>

      <QuickActions />
      <MeetingList />
    </DashboardLayout>
  );
};

export default Dashboard;
