import React from 'react';
import { Video, Globe, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-500 p-1.5 rounded-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Nexus Meet</span>
            </div>
            <p className="text-slate-400 text-sm">
              Connect and collaborate securely from anywhere with premium video conferencing.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-slate-400 hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Security</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Nexus Meet. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Globe className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
