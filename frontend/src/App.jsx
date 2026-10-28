import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BackendStatusBanner from './components/BackendStatusBanner';
import Hero from './components/Hero';
import LearningMissions from './components/LearningMissions';
import GateLibrary from './components/GateLibrary';
import CircuitSimulator from './components/CircuitSimulator';
import BlochSphere from './components/BlochSphere';
import BellStatesExplorer from './components/BellStatesExplorer';
import ChallengesLeaderboard from './components/ChallengesLeaderboard';
import JudgeDemoTour from './components/JudgeDemoTour';
import QuantumCertificate from './components/QuantumCertificate';
import StudentSessionModal from './components/StudentSessionModal';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';
import { api } from './api/client';
import { sounds } from './utils/soundEffects';

function getTierTitle(level) {
  switch (level) {
    case 1: return 'Qubit Novice';
    case 2: return 'Gate Apprentice';
    case 3: return 'Bloch Explorer';
    case 4: return 'Entanglement Pioneer';
    case 5: return 'Bell State Master';
    case 6: return 'Circuit Architect';
    case 7: return 'Grand Quantum Master';
    default: return 'Quantum Explorer';
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);

  // Student Profile & Expo Session state
  const [currentStudent, setCurrentStudent] = useState({
    name: 'Student Explorer',
    school: 'Visiting Student',
    avatar: '⚛️',
    score: 150,
    rank: null,
  });
  const [recentStudents, setRecentStudents] = useState([]);

  // Gamification state
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXp, setPlayerXp] = useState(150);
  const [completedMissions, setCompletedMissions] = useState([1]);

  // Modal dialog states
  const [showTour, setShowTour] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Load saved student and progress from localStorage
  useEffect(() => {
    try {
      const savedStudent = localStorage.getItem('quantum_current_student');
      const savedRecents = localStorage.getItem('quantum_recent_students');
      const savedXp = localStorage.getItem('quantum_player_xp');
      const savedLevel = localStorage.getItem('quantum_player_level');
      const savedMissions = localStorage.getItem('quantum_completed_missions');

      if (savedStudent) setCurrentStudent(JSON.parse(savedStudent));
      if (savedRecents) setRecentStudents(JSON.parse(savedRecents));
      if (savedXp) setPlayerXp(Number(savedXp));
      if (savedLevel) setPlayerLevel(Number(savedLevel));
      if (savedMissions) setCompletedMissions(JSON.parse(savedMissions));
    } catch (err) {
      console.warn('LocalStorage load error:', err);
    }
  }, []);

  // Start new student player session
  const handleStartNewStudent = async ({ name, school, avatar }) => {
    const initialXp = 100;
    const initialLevel = 1;
    const initialMissions = [1];

    const studentData = {
      name,
      school: school || 'Visiting Student',
      avatar: avatar || '⚛️',
      score: initialXp,
      rank: null,
      timestamp: new Date().toISOString(),
    };

    // Reset gameplay state for new student
    setCurrentStudent(studentData);
    setPlayerXp(initialXp);
    setPlayerLevel(initialLevel);
    setCompletedMissions(initialMissions);

    // Save to localStorage
    localStorage.setItem('quantum_current_student', JSON.stringify(studentData));
    localStorage.setItem('quantum_player_xp', String(initialXp));
    localStorage.setItem('quantum_player_level', String(initialLevel));
    localStorage.setItem('quantum_completed_missions', JSON.stringify(initialMissions));

    // Update recent students list
    setRecentStudents((prev) => {
      const filtered = prev.filter((s) => s.name.toLowerCase() !== name.toLowerCase());
      const updated = [studentData, ...filtered].slice(0, 15);
      localStorage.setItem('quantum_recent_students', JSON.stringify(updated));
      return updated;
    });

    // Register with backend leaderboard immediately
    try {
      const res = await api.submitScore({
        name,
        score: initialXp,
        level: getTierTitle(initialLevel),
        badge: 'QExpo Attendee',
        streak: 1,
        school: studentData.school,
      });
      if (res && res.rank) {
        studentData.rank = res.rank;
        setCurrentStudent({ ...studentData });
        localStorage.setItem('quantum_current_student', JSON.stringify(studentData));
      }
    } catch (err) {
      console.warn('Failed to submit initial student score:', err);
    }
  };

  // Switch to an existing recent student & load progress from database
  const handleSwitchStudent = async (student) => {
    setCurrentStudent(student);
    const score = student.score || student.xp || 100;
    setPlayerXp(score);
    localStorage.setItem('quantum_current_student', JSON.stringify(student));
    localStorage.setItem('quantum_player_xp', String(score));

    // Pull student's progress directly from the persistent database
    try {
      const profile = await api.getStudentProfile(student.name);
      if (profile) {
        if (profile.score !== undefined) {
          setPlayerXp(profile.score);
          localStorage.setItem('quantum_player_xp', String(profile.score));
        }
        if (profile.completed_missions_list && profile.completed_missions_list.length > 0) {
          setCompletedMissions(profile.completed_missions_list);
          localStorage.setItem('quantum_completed_missions', JSON.stringify(profile.completed_missions_list));
        }
        setCurrentStudent((prev) => ({
          ...prev,
          ...profile,
          score: profile.score,
          rank: profile.rank,
        }));
      }
    } catch {}
  };

  // Update student XP and sync with database
  const handleUpdateXp = async (delta) => {
    const newXp = playerXp + delta;
    setPlayerXp(newXp);
    localStorage.setItem('quantum_player_xp', String(newXp));

    const updatedStudent = { ...currentStudent, score: newXp };
    setCurrentStudent(updatedStudent);
    localStorage.setItem('quantum_current_student', JSON.stringify(updatedStudent));

    try {
      const res = await api.saveStudentProgress({
        name: currentStudent.name,
        score: newXp,
        level: getTierTitle(playerLevel),
        badge: 'Active Explorer',
        streak: 3,
        school: currentStudent.school,
        avatar: currentStudent.avatar,
        completed_missions: completedMissions,
      });
      if (res && res.rank) {
        updatedStudent.rank = res.rank;
        setCurrentStudent({ ...updatedStudent });
      }
    } catch {}
  };

  // Save progress changes to persistent database & local backup
  const handleMissionCompleted = async (missionId, xpReward) => {
    sounds.playVictory();
    const newXp = playerXp + xpReward;
    const newLevel = Math.max(playerLevel, Math.min(7, missionId + 1));

    setPlayerXp(newXp);
    localStorage.setItem('quantum_player_xp', String(newXp));

    setPlayerLevel(newLevel);
    localStorage.setItem('quantum_player_level', String(newLevel));

    let updatedMissions = completedMissions;
    if (!completedMissions.includes(missionId)) {
      updatedMissions = [...completedMissions, missionId];
      setCompletedMissions(updatedMissions);
      localStorage.setItem('quantum_completed_missions', JSON.stringify(updatedMissions));
    }

    const updatedStudent = {
      ...currentStudent,
      score: newXp,
      level: getTierTitle(newLevel),
    };
    setCurrentStudent(updatedStudent);
    localStorage.setItem('quantum_current_student', JSON.stringify(updatedStudent));

    // Update in recent students cache
    setRecentStudents((prev) => {
      const updated = prev.map((s) =>
        s.name.toLowerCase() === currentStudent.name.toLowerCase()
          ? { ...s, score: newXp }
          : s
      );
      localStorage.setItem('quantum_recent_students', JSON.stringify(updated));
      return updated;
    });

    // Save directly into the persistent database!
    try {
      const res = await api.saveStudentProgress({
        name: currentStudent.name,
        score: newXp,
        level: getTierTitle(newLevel),
        badge: missionId >= 6 ? 'Circuit Architect' : 'Mission Completed',
        streak: 3,
        school: currentStudent.school,
        avatar: currentStudent.avatar,
        completed_missions: updatedMissions,
      });
      if (res && res.rank) {
        updatedStudent.rank = res.rank;
        setCurrentStudent({ ...updatedStudent });
      }
    } catch (err) {
      console.warn('Database save error:', err);
    }
  };

  // Check backend health periodically
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

  const navigateToTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateToTab}
        isBackendHealthy={isBackendHealthy}
        onCheckHealth={checkHealth}
        onOpenTour={() => setShowTour(true)}
        onOpenCertificate={() => setShowCertificate(true)}
        onOpenStudentModal={() => setShowStudentModal(true)}
        currentStudent={currentStudent}
        playerLevel={playerLevel}
        playerXp={playerXp}
      />

      {/* Backend Status Warning if Server is Offline */}
      <BackendStatusBanner
        isBackendHealthy={isBackendHealthy}
        onRetry={checkHealth}
        isChecking={isCheckingHealth}
      />

      {/* Floating Guided Tour for Judges */}
      <JudgeDemoTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onNavigate={navigateToTab}
        onOpenCertificate={() => setShowCertificate(true)}
      />

      {/* Student Session & Registration Modal for Expo Booth */}
      <StudentSessionModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        currentStudent={currentStudent}
        onStartNewStudent={handleStartNewStudent}
        onSwitchStudent={handleSwitchStudent}
        onOpenCertificate={() => setShowCertificate(true)}
        recentStudents={recentStudents}
      />

      {/* Quantum Master Certificate Modal */}
      {showCertificate && (
        <QuantumCertificate
          playerName={currentStudent.name}
          playerSchool={currentStudent.school}
          playerXp={playerXp}
          playerLevel={playerLevel}
          playerRank={currentStudent.rank}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* TAB 1: HOME */}
        {activeTab === 'hero' && (
          <div className="space-y-12">
            <Hero
              onSelectModule={navigateToTab}
              onOpenTour={() => setShowTour(true)}
              onOpenPresentation={() => setShowTour(true)}
              onOpenStudentModal={() => setShowStudentModal(true)}
              currentStudent={currentStudent}
            />

            {/* Teaser of the 3D Bloch Sphere directly on Home */}
            <div className="border-t border-slate-800/80 pt-8">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                  Interactive Preview
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">
                  Live 3D Bloch Sphere Sandbox
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Interact with the 3D state vector in real time. Apply quantum gates and explore relative phases.
                </p>
              </div>
              <BlochSphere />
            </div>

            <TeamSection />
          </div>
        )}

        {/* TAB 2: LEARNING MISSIONS (Levels 1 to 7) */}
        {activeTab === 'missions' && (
          <div className="space-y-12">
            <LearningMissions
              playerLevel={playerLevel}
              playerXp={playerXp}
              completedMissions={completedMissions}
              onMissionCompleted={handleMissionCompleted}
              onOpenCertificate={() => setShowCertificate(true)}
            />
            <TeamSection />
          </div>
        )}

        {/* TAB 3: QUANTUM LAB (Gate Library) */}
        {activeTab === 'gate' && (
          <div className="space-y-12">
            <GateLibrary />
            <TeamSection />
          </div>
        )}

        {/* TAB 4: CIRCUIT SIMULATOR */}
        {activeTab === 'circuit' && (
          <div className="space-y-12">
            <CircuitSimulator />
            <TeamSection />
          </div>
        )}

        {/* TAB 5: BLOCH SPHERE */}
        {activeTab === 'bloch' && (
          <div className="space-y-12">
            <BlochSphere />
            <TeamSection />
          </div>
        )}

        {/* TAB 6: BELL STATES */}
        {activeTab === 'bell' && (
          <div className="space-y-12">
            <BellStatesExplorer />
            <TeamSection />
          </div>
        )}

        {/* TAB 7: CHALLENGES & LEADERBOARD */}
        {activeTab === 'challenges' && (
          <div className="space-y-12">
            <ChallengesLeaderboard
              playerXp={playerXp}
              playerLevel={playerLevel}
              currentStudent={currentStudent}
              onUpdateXp={handleUpdateXp}
              onOpenCertificate={() => setShowCertificate(true)}
              onOpenStudentModal={() => setShowStudentModal(true)}
            />
            <TeamSection />
          </div>
        )}
      </main>

      {/* Expo Footer */}
      <Footer />
    </div>
  );
}
