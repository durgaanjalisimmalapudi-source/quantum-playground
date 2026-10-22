import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BackendStatusBanner from './components/BackendStatusBanner';
import Hero from './components/Hero';
import QubitExplorer from './components/QubitExplorer';
import GateLab from './components/GateLab';
import EntanglementExplorer from './components/EntanglementExplorer';
import QuizArena from './components/QuizArena';
import PresentationMode from './components/PresentationMode';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';
import { api } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);

  // Check backend health on initial load and setup interval
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await api.checkHealth();
      if (res && res.status === 'healthy') {
        setIsBackendHealthy(true);
      } else {
        setIsBackendHealthy(false);
      }
    } catch {
      setIsBackendHealthy(false);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const scrollToModule = (moduleId) => {
    setActiveTab(moduleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendHealthy={isBackendHealthy}
        onCheckHealth={checkHealth}
        presentationMode={presentationMode}
        setPresentationMode={setPresentationMode}
      />

      {/* Backend Status Warning if Server is Offline */}
      <BackendStatusBanner
        isBackendHealthy={isBackendHealthy}
        onRetry={checkHealth}
        isChecking={isCheckingHealth}
      />

      {/* Presentation Mode Overlay */}
      {presentationMode && (
        <PresentationMode onClose={() => setPresentationMode(false)} />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'hero' && (
          <>
            <Hero
              onSelectModule={scrollToModule}
              onOpenPresentation={() => setPresentationMode(true)}
            />
            {/* Quick Teaser of Module 1 */}
            <div className="border-t border-slate-800/80">
              <QubitExplorer />
            </div>
            <TeamSection />
          </>
        )}

        {activeTab === 'qubit' && (
          <div>
            <QubitExplorer />
            <TeamSection />
          </div>
        )}

        {activeTab === 'gate' && (
          <div>
            <GateLab />
            <TeamSection />
          </div>
        )}

        {activeTab === 'entanglement' && (
          <div>
            <EntanglementExplorer />
            <TeamSection />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div>
            <QuizArena />
            <TeamSection />
          </div>
        )}
      </main>

      {/* Expo-grade Footer */}
      <Footer />
    </div>
  );
}
