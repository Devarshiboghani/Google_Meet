import React from 'react';
import { PlusCircle, Share2, LogIn, Video } from 'lucide-react';

const steps = [
  {
    title: 'Create a Meeting',
    description: 'Click "Start a Meeting" to instantly generate a secure, unique meeting room.',
    icon: PlusCircle,
  },
  {
    title: 'Share the Link',
    description: 'Copy the meeting link or ID and send it to your team or clients.',
    icon: Share2,
  },
  {
    title: 'Join the Room',
    description: 'Participants can join from any device directly via their web browser.',
    icon: LogIn,
  },
  {
    title: 'Start Collaborating',
    description: 'Turn on your camera, share your screen, and get work done together.',
    icon: Video,
  },
];

const HowItWorksSection = () => {
  return (
    <div id="how-it-works" className="py-24 bg-slate-800/30 border-y border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple and intuitive workflow
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get your meeting started in seconds. No downloads required for your guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/10 via-blue-500/30 to-blue-500/10"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 relative z-10 shadow-xl">
                <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-xl"></div>
                <step.icon className="h-10 w-10 text-emerald-400" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-4 border-slate-900">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
