import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import CTASection from '../components/landing/CTASection';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-blue-500/30 font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
