import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-500 p-1.5 rounded-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Nexus Meet
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How it Works</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
