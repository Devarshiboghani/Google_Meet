import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <div className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to transform how you meet?
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Join thousands of teams who rely on Nexus Meet for their daily communication and collaboration. Free for personal use.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/signup" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
          >
            Log into your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
