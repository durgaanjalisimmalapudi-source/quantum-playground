import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Clock,
  Award,
  Zap,
  CheckCircle2,
  Sparkles,
  Play,
  RotateCcw,
  Shield,
  Star,
  Users,
  Compass,
  Download,
  RefreshCw,
  UserPlus,
  Search,
  Filter,
  School,
  ExternalLink,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { api } from '../api/client';

const ACHIEVEMENTS = [
  { id: 'first_superposition', title: 'First Superposition', desc: 'Prepared |+⟩ using a Hadamard gate.', icon: '⚛️', unlocked: true },
  { id: 'phase_master', title: 'Phase Alchemist', desc: 'Controlled complex relative phases on the Bloch sphere.', icon: '🌀', unlocked: true },
  { id: 'spooky_action', title: 'Spooky Action Hero', desc: 'Simulated all 4 Bell states on Qiskit Aer.', icon: '⚡', unlocked: true },
  { id: 'circuit_architect', title: 'Circuit Architect', desc: 'Constructed an algorithm with 3 or more qubits.', icon: '💻', unlocked: false },
  { id: 'teleport_pioneer', title: 'Teleportation Pioneer', desc: 'Successfully simulated the 3-qubit teleportation protocol.', icon: '🚀', unlocked: false },
  { id: 'chsh_champion', title: 'CHSH Non-Localist', desc: 'Proved quantum correlation across rotated measurement bases.', icon: '🏆', unlocked: false },
];

function getLevelTitle(level) {
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

export default function ChallengesLeaderboard({
  playerXp = 0,
  playerLevel = 1,
  currentStudent = { name: 'Quantum Explorer', school: 'Visitor', avatar: '⚛️' },
  onUpdateXp = null,
  onOpenCertificate = null,
  onOpenStudentModal = null,
}) {
  const [activeTab, setActiveTab] = useState('leaderboard'); // daily, timed, leaderboard, achievements
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [dailyGuess, setDailyGuess] = useState('');

  // Timed challenge state
  const [timedActive, setTimedActive] = useState(false);
  const [timedSeconds, setTimedSeconds] = useState(60);
  const [timedScore, setTimedScore] = useState(0);
  const [timedQuestionIdx, setTimedQuestionIdx] = useState(0);
  const [timedFinished, setTimedFinished] = useState(false);
  const [timedRankAwarded, setTimedRankAwarded] = useState(null);

  // Persistent Leaderboard state
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, students
  const [currentPlayerRank, setCurrentPlayerRank] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const timedQuestions = [
    { q: 'H |0⟩ = ?', opts: ['|1⟩', '|+⟩', '|−⟩', '|0⟩'], ans: 1 },
    { q: 'X |1⟩ = ?', opts: ['|0⟩', '|1⟩', '|+⟩', 'i|0⟩'], ans: 0 },
    { q: 'What is X · X ?', opts: ['Z', 'H', 'I (Identity)', 'Y'], ans: 2 },
    { q: 'Z |+⟩ = ?', opts: ['|−⟩', '|+⟩', '|1⟩', '|0⟩'], ans: 0 },
    { q: 'S · S = ?', opts: ['X', 'Z', 'T', 'H'], ans: 1 },
    { q: 'Which Bell state is (|00⟩ + |11⟩)/√2?', opts: ['|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩'], ans: 0 },
  ];

  // Load and refresh leaderboard from backend
  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const data = await api.getLeaderboard();
      if (data && data.entries) {
        setLeaderboardEntries(data.entries);
        const playerEntry = data.entries.find(
          (e) => e.name.toLowerCase() === (currentStudent.name || '').toLowerCase()
        );
        if (playerEntry) {
          setCurrentPlayerRank(playerEntry.rank);
        }
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 12000);
    return () => clearInterval(interval);
  }, [currentStudent.name]);

  // Timed challenge countdown
  useEffect(() => {
    let timer;
    if (timedActive && timedSeconds > 0) {
      timer = setInterval(() => {
        setTimedSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timedSeconds === 0 && timedActive) {
      finishTimedSprint(timedScore);
    }
    return () => clearInterval(timer);
  }, [timedActive, timedSeconds]);

  const startTimedChallenge = () => {
    sounds.playGateClick(600);
    setTimedActive(true);
    setTimedSeconds(60);
    setTimedScore(0);
    setTimedQuestionIdx(0);
    setTimedFinished(false);
    setTimedRankAwarded(null);
  };

  const finishTimedSprint = async (finalScore) => {
    setTimedActive(false);
    setTimedFinished(true);
    sounds.playVictory();

    // Award XP
    const newTotalXp = (playerXp || 0) + finalScore;
    if (onUpdateXp) {
      onUpdateXp(finalScore);
    }

    // Submit to persistent leaderboard
    try {
      const studentName = currentStudent?.name || 'Quantum Explorer';
      const studentSchool = currentStudent?.school || 'Visitor';
      const submitRes = await api.submitScore({
        name: studentName,
        score: newTotalXp,
        level: getLevelTitle(playerLevel),
        badge: finalScore >= 400 ? 'Quantum Speedster' : 'Sprint Participant',
        streak: 5,
        school: studentSchool,
      });
      if (submitRes && submitRes.rank) {
        setTimedRankAwarded(submitRes.rank);
        setCurrentPlayerRank(submitRes.rank);
        fetchLeaderboard();
      }
    } catch (e) {
      console.error('Failed to submit sprint score:', e);
    }
  };

  const handleTimedAnswer = (idx) => {
    let currentScore = timedScore;
    if (idx === timedQuestions[timedQuestionIdx].ans) {
      sounds.playGateClick(800);
      currentScore += 100;
      setTimedScore(currentScore);
    } else {
      sounds.playError();
    }

    if (timedQuestionIdx < timedQuestions.length - 1) {
      setTimedQuestionIdx((prev) => prev + 1);
    } else {
      finishTimedSprint(currentScore);
    }
  };

  const solveDaily = async (choice) => {
    setDailyGuess(choice);
    if (choice === 'H then S') {
      sounds.playVictory();
      setDailyCompleted(true);
      const bonusXp = 150;
      const newTotal = (playerXp || 0) + bonusXp;
      if (onUpdateXp) onUpdateXp(bonusXp);

      // Submit to leaderboard
      try {
        const studentName = currentStudent?.name || 'Quantum Explorer';
        const submitRes = await api.submitScore({
          name: studentName,
          score: newTotal,
          level: getLevelTitle(playerLevel),
          badge: 'Daily Solver',
          streak: 5,
          school: currentStudent?.school || 'Visitor',
        });
        if (submitRes && submitRes.rank) {
          setCurrentPlayerRank(submitRes.rank);
          fetchLeaderboard();
        }
      } catch {}
    } else {
      sounds.playError();
    }
  };

  const handleResetLeaderboard = async () => {
    sounds.playGateClick(500);
    try {
      const res = await api.resetLeaderboard();
      if (res && res.entries) {
        setLeaderboardEntries(res.entries);
      }
      setIsResetConfirmOpen(false);
    } catch {}
  };

  const handleClearLeaderboard = async () => {
    sounds.playGateClick(500);
    try {
      const res = await api.clearLeaderboard();
      if (res && res.entries) {
        setLeaderboardEntries(res.entries);
        setCurrentPlayerRank(null);
      }
      setIsClearConfirmOpen(false);
    } catch {}
  };

  const handleExportCsv = () => {
    sounds.playGateClick(700);
    window.open('/api/leaderboard/export', '_blank');
  };

  // Filter and search logic
  const filteredEntries = leaderboardEntries.filter((item) => {
    if (filterType === 'students' && item.is_seed) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = (item.name || '').toLowerCase().includes(q);
    const schoolMatch = (item.school || '').toLowerCase().includes(q);
    return nameMatch || schoolMatch;
  });

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-3.5 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Challenges, Achievements & Expo Leaderboard
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compete in daily challenges, test speed in 60s sprints, and view real-time stored rankings of visiting students.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto max-w-full touch-pan-x scrollbar-thin">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0 min-h-[36px] ${
              activeTab === 'leaderboard'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => setActiveTab('timed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0 min-h-[36px] ${
              activeTab === 'timed'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timed Sprint</span>
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0 min-h-[36px] ${
              activeTab === 'daily'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Daily Challenge</span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0 min-h-[36px] ${
              activeTab === 'achievements'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badges</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Live Stored Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {/* Top Bar: Controls & Active Student Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Current Playing Student Tag */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentStudent.avatar || '⚛️'}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Active Student:</span>
                  <span className="text-sm font-bold text-cyan-300">
                    {currentStudent.name || 'Quantum Explorer'}
                  </span>
                  {currentStudent.school && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      • {currentStudent.school}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
                  <span className="text-emerald-400 font-bold">
                    Score: {playerXp} XP
                  </span>
                  {currentPlayerRank && (
                    <span className="text-amber-400 font-bold">
                      Current Expo Rank: #{currentPlayerRank}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onOpenStudentModal && (
                <button
                  onClick={onOpenStudentModal}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  title="Switch student player or start next student session"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Next Student Player</span>
                </button>
              )}

              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Download CSV of all student rankings for the expo"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                onClick={fetchLeaderboard}
                disabled={isLoadingLeaderboard}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
                title="Refresh rankings"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLeaderboard ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, schools, colleges..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px]">Filter:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${
                  filterType === 'all'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                All ({leaderboardEntries.length})
              </button>
              <button
                onClick={() => setFilterType('students')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${
                  filterType === 'students'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                Visiting Students ({leaderboardEntries.filter((e) => !e.is_seed).length})
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
            <div className="sm:hidden text-center text-[10px] text-cyan-400/80 font-mono py-1.5 bg-cyan-950/40 border-b border-slate-800 flex items-center justify-center gap-1.5">
              <span>⇄ Swipe horizontally to view full rankings table</span>
            </div>
            <div className="overflow-x-auto touch-pan-x">
              <table className="w-full text-xs text-left font-mono min-w-[540px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px]">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Student Player</th>
                    <th className="py-3 px-4">School / Organization</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Streak</th>
                    <th className="py-3 px-4 text-right">XP Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {filteredEntries.map((p) => {
                    const isCurrent =
                      currentStudent?.name &&
                      p.name.trim().toLowerCase() === currentStudent.name.trim().toLowerCase();
                    return (
                      <tr
                        key={p.id || p.rank}
                        className={`transition ${
                          isCurrent
                            ? 'bg-cyan-950/50 text-cyan-200 font-bold border-l-4 border-l-cyan-400'
                            : 'text-slate-300 hover:bg-slate-900/40'
                        }`}
                      >
                        <td className="py-3 px-4 text-sm">
                          {p.rank === 1 ? (
                            <span className="flex items-center gap-1 text-amber-300 font-black">
                              🥇 1
                            </span>
                          ) : p.rank === 2 ? (
                            <span className="flex items-center gap-1 text-slate-200 font-black">
                              🥈 2
                            </span>
                          ) : p.rank === 3 ? (
                            <span className="flex items-center gap-1 text-amber-500 font-black">
                              🥉 3
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold">#{p.rank}</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{p.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                                YOU
                              </span>
                            )}
                            {p.badge && (
                              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-400 border border-slate-700">
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {p.school || 'Visitor'}
                        </td>

                        <td className="py-3 px-4 text-slate-300 text-[11px]">
                          {p.level}
                        </td>

                        <td className="py-3 px-4 text-amber-400 font-bold">
                          {p.streak || 1} 🔥
                        </td>

                        <td className="py-3 px-4 text-right text-emerald-400 font-black text-sm">
                          {isCurrent ? Math.max(p.score, playerXp) : p.score} XP
                        </td>
                      </tr>
                    );
                  })}

                  {filteredEntries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        {leaderboardEntries.length === 0 ? (
                          <div className="max-w-md mx-auto space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 animate-float">
                              <Trophy className="w-7 h-7" />
                            </div>
                            <h4 className="text-base font-bold text-white tracking-wide">
                              Leaderboard is Clean & Ready for QExpo 2026!
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              All previous test scores have been wiped clean. Register as the first student player or solve a timed sprint to claim <strong className="text-amber-300 font-mono">Rank #1</strong>!
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                              {onOpenStudentModal && (
                                <button
                                  onClick={onOpenStudentModal}
                                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
                                >
                                  👤 Register Student Player
                                </button>
                              )}
                              <button
                                onClick={() => setActiveTab('timed')}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Start 60s Sprint</span>
                              </button>
                              <button
                                onClick={handleResetLeaderboard}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs transition"
                              >
                                Load Demo Benchmarks
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span>No students found matching "{searchQuery}".</span>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer with Clear and Reset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 pt-1">
            <span>
              All scores are persistently stored in backend JSON & synced across sessions.
            </span>

            <div className="flex items-center gap-3">
              {/* Clear All Button */}
              {isClearConfirmOpen ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-semibold">Wipe all entries?</span>
                  <button
                    onClick={handleClearLeaderboard}
                    className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]"
                  >
                    Yes, Wipe Clean
                  </button>
                  <button
                    onClick={() => setIsClearConfirmOpen(false)}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsClearConfirmOpen(true)}
                  className="text-slate-500 hover:text-rose-400 underline transition"
                  title="Wipe all entries and leave leaderboard clean"
                >
                  Admin: Clean Leaderboard
                </button>
              )}

              {/* Reset to Seeds Button */}
              {isResetConfirmOpen ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-semibold">Load seeds?</span>
                  <button
                    onClick={handleResetLeaderboard}
                    className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px]"
                  >
                    Yes, Load Seeds
                  </button>
                  <button
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="text-slate-500 hover:text-slate-300 underline transition"
                  title="Reset leaderboard back to seed benchmarks"
                >
                  Load Demo Benchmarks
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timed Sprint */}
      {activeTab === 'timed' && (
        <div className="p-3.5 sm:p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                60-Second Quantum Speedrun
              </h3>
              <p className="text-xs text-slate-400">
                Playing as: <strong className="text-cyan-300">{currentStudent.name}</strong> • Answer rapid-fire quantum gates before time expires!
              </p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="font-mono text-xl font-black text-amber-400">
                {timedSeconds}s
              </div>
              <div className="font-mono text-xl font-black text-cyan-400">
                {timedScore} PTS
              </div>
            </div>
          </div>

          {!timedActive && !timedFinished ? (
            <div className="text-center py-8 space-y-4">
              <Sparkles className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">Ready for the Quantum Sprint?</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Test your mental quantum gates without paper! Solve 6 rapid-fire questions to boost your score on the QExpo Leaderboard.
              </p>
              <button
                onClick={startTimedChallenge}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition transform hover:scale-105"
              >
                Start 60s Sprint
              </button>
            </div>
          ) : timedActive ? (
            <div className="space-y-4 max-w-lg mx-auto text-center py-4">
              <span className="text-xs font-mono text-slate-400 block">
                Question {timedQuestionIdx + 1} of {timedQuestions.length}
              </span>
              <div className="text-2xl font-black font-mono text-cyan-300">
                {timedQuestions[timedQuestionIdx].q}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-4">
                {timedQuestions[timedQuestionIdx].opts.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTimedAnswer(idx)}
                    className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold text-sm transition transform hover:scale-[1.02]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Sprint Completed!</h4>
              <p className="text-sm text-cyan-300 font-mono font-bold">
                Sprint Score: +{timedScore} PTS added to your XP!
              </p>

              {timedRankAwarded && (
                <div className="p-3 max-w-md mx-auto rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-mono">
                  🎉 Recorded to Persistent QExpo Leaderboard at <strong>Rank #{timedRankAwarded}</strong>!
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                <button
                  onClick={startTimedChallenge}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Play Sprint Again
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow"
                >
                  View Leaderboard
                </button>
                {onOpenCertificate && (
                  <button
                    onClick={onOpenCertificate}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
                  >
                    Claim Certificate
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Daily Quantum Challenge */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 p-3.5 sm:p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                <span className="font-bold text-white text-base">
                  Daily Challenge #{new Date().getDate()}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  +150 XP
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Refreshes at 00:00 UTC</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-100">
                Phase Navigator: Reach the Equatorial Imaginary Axis
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Starting from the ground state |0⟩, which 2-gate sequence rotates the qubit into the state |+i⟩ = (|0⟩ + i|1⟩)/√2 on the Y-axis?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
              {['H then S', 'X then H', 'H then Z', 'S then X'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => solveDaily(opt)}
                  disabled={dailyCompleted}
                  className={`p-3 rounded-lg border text-xs font-mono font-bold transition text-left flex items-center justify-between ${
                    dailyGuess === opt
                      ? opt === 'H then S'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  {dailyGuess === opt && opt === 'H then S' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>

            {dailyCompleted && (
              <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs leading-relaxed space-y-1">
                <strong className="block text-emerald-300">🎉 Solved! +150 XP Awarded & Saved to Leaderboard</strong>
                Hadamard maps |0⟩ into |+⟩ along the X-axis. Then S applies a 90° (π/2) phase shift along Z, turning +1 into +i along the Y-axis!
              </div>
            )}
          </div>

          {/* Daily Streak Card */}
          <div className="lg:col-span-4 p-5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              Current Hacker Streak
            </span>
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex flex-col items-center justify-center">
              <Flame className="w-7 h-7 text-amber-400" />
              <span className="text-base font-black text-white font-mono">4 Days</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Solve consecutive daily puzzles to earn streak multipliers and climb the QExpo leaderboard.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Badges & Achievements */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border flex items-start gap-3 transition ${
                ach.unlocked
                  ? 'bg-slate-950/80 border-amber-500/30 text-slate-200'
                  : 'bg-slate-950/40 border-slate-900 opacity-50 text-slate-500'
              }`}
            >
              <div className="text-2xl">{ach.icon}</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{ach.title}</span>
                  {ach.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
