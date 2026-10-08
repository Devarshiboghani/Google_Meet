import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Video, Calendar, Clock, MessageSquare, 
  Settings, User, Menu, X, LogOut, Search, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Meetings', path: '/dashboard/meetings', icon: Video },
    { name: 'Recordings', path: '/dashboard/recordings', icon: Clock },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-500 p-1.5 rounded-lg">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Nexus Meet
            </span>
          </Link>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-rose-400 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center">
            <button 
              className="lg:hidden p-2 mr-4 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-white hidden sm:block">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || 'U')}
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-slate-200">{user?.name || 'User'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
