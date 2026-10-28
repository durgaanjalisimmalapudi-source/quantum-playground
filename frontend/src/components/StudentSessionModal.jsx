import React, { useState } from 'react';
import {
  UserPlus,
  Users,
  Trophy,
  Award,
  Sparkles,
  X,
  CheckCircle2,
  School,
  ArrowRight,
  RotateCcw,
  Shield,
  Zap,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const AVATAR_OPTIONS = [
  { icon: '⚛️', label: 'Qubit Explorer' },
  { icon: '🌀', label: 'Superposition Prodigy' },
  { icon: '⚡', label: 'Entanglement Hacker' },
  { icon: '🚀', label: 'Circuit Architect' },
  { icon: '🔮', label: 'Quantum Oracle' },
  { icon: '🌟', label: 'QExpo Champion' },
];

export default function StudentSessionModal({
  isOpen,
  onClose,
  currentStudent,
  onStartNewStudent,
  onSwitchStudent,
  onOpenCertificate,
  recentStudents = [],
}) {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].icon);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg('Please enter the student’s name to continue');
      sounds.playError();
      return;
    }

    sounds.playVictory();
    onStartNewStudent({
      name: cleanName,
      school: school.trim() || 'Student Visitor',
      avatar: selectedAvatar,
    });
    setName('');
    setSchool('');
    setErrorMsg('');
    onClose();
  };

  const handleSelectRecent = (student) => {
    sounds.playGateClick(700);
    onSwitchStudent(student);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-950 border-2 border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Next Student Player Registration
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                QExpo '26
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome visiting students! Each student gets an independent session and live leaderboard ranking.
            </p>
          </div>
        </div>

        {/* Current Student Summary (if exists) */}
        {currentStudent && currentStudent.name && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentStudent.avatar || '⚛️'}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Current Player:</span>
                  <span className="text-sm font-bold text-amber-300">
                    {currentStudent.name}
                  </span>
                  {currentStudent.school && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({currentStudent.school})
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-3 mt-0.5">
                  <span className="text-emerald-400 font-bold">
                    {currentStudent.score || currentStudent.xp || 0} XP
                  </span>
                  {currentStudent.rank && (
                    <span className="text-cyan-400 font-bold">
                      Rank #{currentStudent.rank}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onOpenCertificate) onOpenCertificate();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Award className="w-3.5 h-3.5" />
              Claim Certificate
            </button>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Student Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Arjun Sharma, Priya Patel, David Kim..."
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
            />
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-1 font-mono">{errorMsg}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              School / College / Organization <span className="text-slate-500 text-[10px]">(Optional)</span>
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Delhi Public School, IIT, High School, Visitor..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Avatar / Badge Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Choose Quantum Avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  type="button"
                  key={av.label}
                  onClick={() => setSelectedAvatar(av.icon)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    selectedAvatar === av.icon
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                  title={av.label}
                >
                  <span className="text-xl">{av.icon}</span>
                  <span className="text-[9px] font-mono mt-1 truncate max-w-full">
                    {av.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-pink-600 hover:from-cyan-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <span>Start Quantum Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Switch to Recent Students */}
        {recentStudents && recentStudents.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Recent Students Today ({recentStudents.length})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Click to resume player
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
              {recentStudents.slice(0, 6).map((st) => (
                <button
                  key={st.name}
                  onClick={() => handleSelectRecent(st)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 flex items-center gap-2 transition"
                >
                  <span>{st.avatar || '⚛️'}</span>
                  <span className="font-semibold text-white">{st.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {st.score || st.xp || 0}XP
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
