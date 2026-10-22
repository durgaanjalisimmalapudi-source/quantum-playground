import React, { useState } from 'react';
import { quizQuestions } from '../data/quizQuestions';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, Award, Sparkles, BookOpen } from 'lucide-react';

export default function QuizArena() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [answersHistory, setAnswersHistory] = useState([]);

  const currentQ = quizQuestions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / quizQuestions.length) * 100);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selected: idx,
        correct: currentQ.correctIndex,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowSummary(false);
    setAnswersHistory([]);
  };

  const getRankBadge = (points, total) => {
    const ratio = points / total;
    if (ratio === 1) return { title: 'Quantum Grandmaster', color: 'text-amber-400 bg-amber-950/60 border-amber-500/50', desc: 'Flawless 100%! Ready to present to the QExpo 2026 grand jury.' };
    if (ratio >= 0.8) return { title: 'Quantum Researcher', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/50', desc: 'Outstanding grasp of quantum gates, superposition, and entanglement!' };
    if (ratio >= 0.6) return { title: 'Quantum Apprentice', color: 'text-violet-400 bg-violet-950/60 border-violet-500/50', desc: 'Good foundation. Review phase and Bell inequalities to master the field.' };
    return { title: 'Curious Explorer', color: 'text-slate-300 bg-slate-900 border-slate-700', desc: 'Great start! Walk through the Qubit Explorer and Gate Lab modules again.' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-300">
              Module 4
            </span>
            <span className="text-xs text-slate-400">Knowledge Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Quantum Quiz Arena</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Test your understanding across qubits, gates, Born's rule, Bell states, and Qiskit.
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Quiz</span>
        </button>
      </div>

      {!showSummary ? (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <span className="text-xs font-mono text-cyan-400 font-bold">
                Question {currentIndex + 1} of {quizQuestions.length}
              </span>
              <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Score: {score}/{currentIndex + (isAnswered ? 1 : 0)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full sm:w-48 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{currentQ.topic}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-850';
                let icon = null;

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-glow-cyan';
                    icon = <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />;
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    icon = <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />;
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-black/40 border border-slate-700 font-mono text-xs flex items-center justify-center shrink-0 text-slate-300">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="mt-0.5">{opt}</span>
                    </div>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Immediate Explanation Banner */}
            {isAnswered && (
              <div className="mt-6 pt-5 border-t border-slate-800/80 animate-fadeIn">
                <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}>
                  <div className="font-bold mb-1 flex items-center space-x-1.5">
                    <span>{selectedOption === currentQ.correctIndex ? '✓ Correct!' : '✗ Explanation:'}</span>
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
                  >
                    <span>{currentIndex < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Final Score Screen */
        <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-slate-800 text-center space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-600/20 border border-cyan-500/40">
            <Award className="w-12 h-12 text-cyan-400" />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Quiz Completed!</h3>
            <p className="text-sm text-slate-400 mt-1">Here is how you performed in the Quantum Arena:</p>
          </div>

          {/* Score Circle */}
          <div className="inline-block p-6 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-5xl font-extrabold font-mono text-cyan-400">
              {score} / {quizQuestions.length}
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
              {Math.round((score / quizQuestions.length) * 100)}% Accuracy
            </div>
          </div>

          {/* Badge Display */}
          {(() => {
            const badge = getRankBadge(score, quizQuestions.length);
            return (
              <div className={`max-w-md mx-auto p-4 rounded-xl border ${badge.color}`}>
                <div className="text-sm font-bold uppercase tracking-wider">{badge.title}</div>
                <div className="text-xs mt-1 text-slate-300">{badge.desc}</div>
              </div>
            );
          })()}

          {/* Action */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
