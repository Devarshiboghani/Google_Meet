import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import MeetingRoom from './pages/MeetingRoom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfilePage from './components/layout/ProfilePage';
import MeetingsPage from './components/layout/MeetingsPage';
import RecordingsPage from './components/layout/RecordingsPage';
import SettingsPage from './components/layout/SettingsPage';
import MessagesPage from './components/layout/MessagesPage';
import { AuthProvider } from './context/AuthContext';

// Placeholder Component for unbuilt routes
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-4">
    <div className="text-center max-w-md w-full bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
      <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">{title}</h1>
      <p className="text-slate-400 mb-8">This page is not implemented yet. It will contain the functional UI for {title}.</p>
      <button 
        onClick={() => window.history.back()} 
        className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all"
      >
        ← Go back
      </button>
    </div>
  </div>
);

// Wrapper to show placeholder content inside DashboardLayout
const DashboardLayoutWrapper = ({ title }) => (
  <DashboardLayout>
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center h-[60vh] flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400">Content for {title} will go here.</p>
    </div>
  </DashboardLayout>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Navigate to="/register" />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard sub-routes */}
          <Route path="/dashboard/meetings" element={<ProtectedRoute><MeetingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/recordings" element={<ProtectedRoute><RecordingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          
          <Route 
            path="/meeting/:id" 
            element={
              <ProtectedRoute>
                <MeetingRoom />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
