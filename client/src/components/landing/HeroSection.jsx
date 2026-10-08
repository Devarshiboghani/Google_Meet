import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Keyboard } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Connect. Collaborate. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Meet from Anywhere.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Premium video meetings for everyone. Experience crystal-clear audio, HD video, and secure collaboration designed for modern teams.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/meeting/new" 
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
            >
              <Video className="w-5 h-5" />
              <span>Start a Meeting</span>
            </Link>
            
            <div className="w-full sm:w-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Keyboard className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Enter meeting code" 
                className="w-full sm:w-64 bg-slate-800/50 border border-slate-700 text-white rounded-xl pl-10 pr-24 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
              />
              <button className="absolute inset-y-1.5 right-1.5 bg-slate-700 hover:bg-slate-600 text-white px-4 rounded-lg text-sm font-medium transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="relative mx-auto max-w-5xl rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-2xl shadow-blue-900/20">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none"></div>
          <img 
            src="/hero-mockup.jpg" 
            alt="Video Conference Interface Mockup" 
            className="w-full h-auto object-cover rounded-2xl md:rounded-[2rem] transform transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
