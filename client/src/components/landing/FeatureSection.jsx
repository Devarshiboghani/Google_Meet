import React from 'react';
import { MonitorPlay, Shield, MessageSquare, Files, Video, Users, Hand, Disc } from 'lucide-react';

const features = [
  {
    name: 'HD Video & Audio',
    description: 'Experience crystal clear meetings with noise cancellation and 1080p resolution support.',
    icon: MonitorPlay,
  },
  {
    name: 'Secure Meetings',
    description: 'End-to-end encryption ensures your conversations stay private and secure at all times.',
    icon: Shield,
  },
  {
    name: 'Real-time Messaging',
    description: 'Chat with participants, share links, and communicate without interrupting the speaker.',
    icon: MessageSquare,
  },
  {
    name: 'Screen Sharing',
    description: 'Present your work seamlessly by sharing your entire screen, a window, or a specific tab.',
    icon: Files,
  },
  {
    name: 'Meeting Recording',
    description: 'Record your meetings with one click and access them instantly securely stored in the cloud.',
    icon: Disc,
  },
  {
    name: 'Participant Management',
    description: 'Host controls allow you to mute all, manage waiting rooms, and remove disruptive attendees.',
    icon: Users,
  },
  {
    name: 'Hand Raise',
    description: 'Keep discussions organized by allowing participants to virtually raise their hand to speak.',
    icon: Hand,
  },
  {
    name: 'Interactive Whiteboard',
    description: 'Brainstorm ideas together in real-time with an integrated virtual whiteboard space.',
    icon: Video,
  },
];

const FeatureSection = () => {
  return (
    <div id="features" className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-blue-400 tracking-wide uppercase mb-3">
            Powerful Features
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need for perfect meetings
          </h3>
          <p className="text-lg text-slate-400">
            We've built all the tools required for teams to collaborate effectively, without the clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                <feature.icon className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">{feature.name}</h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
