import React from 'react';
import DashboardLayout from './DashboardLayout';
import { Camera, Mic, Monitor, Moon, Sun, Volume2 } from 'lucide-react';

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Audio Settings */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white flex items-center mb-4">
              <Mic className="w-5 h-5 mr-2 text-blue-400" />
              Audio
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Microphone</label>
                <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option>Default - Internal Microphone</option>
                  <option>External USB Mic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Speaker</label>
                <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option>Default - Built-in Output</option>
                  <option>External Headphones</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-300">Noise Cancellation</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Video Settings */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white flex items-center mb-4">
              <Camera className="w-5 h-5 mr-2 text-emerald-400" />
              Video
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Camera</label>
                <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                  <option>FaceTime HD Camera</option>
                  <option>USB Web Camera</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Send Resolution</label>
                <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                  <option>Auto (High Definition - 720p)</option>
                  <option>Standard Definition (360p)</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-300">Adjust for low light</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
