import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Key } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">User Profile</h1>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 mb-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" /> : (user?.name?.charAt(0) || 'U')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-slate-400 flex items-center mt-1">
                <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                Verified Account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Full Name</p>
              <p className="text-slate-200 flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                {user?.name}
              </p>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Email Address</p>
              <p className="text-slate-200 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-slate-400" />
                {user?.email}
              </p>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
