import React from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

export default function BackendStatusBanner({ isBackendHealthy, onRetry, isChecking }) {
  if (isBackendHealthy) return null;

  return (
    <div className="bg-rose-950/80 border-b border-rose-600/40 px-4 py-3 text-rose-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
          <div>
            <span className="font-semibold text-rose-300">FastAPI Simulation Backend Not Detected:</span>{' '}
            <span className="text-rose-200 text-xs sm:text-sm">
              Quantum experiments require real local Qiskit Aer simulation. Please start the backend server in a terminal.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="hidden lg:flex items-center space-x-1.5 bg-black/40 px-2.5 py-1 rounded text-xs font-mono border border-rose-500/30 text-rose-300">
            <Terminal className="w-3.5 h-3.5" />
            <span>uvicorn backend.app.main:app --reload --port 8000</span>
          </div>

          <button
            onClick={onRetry}
            disabled={isChecking}
            className="flex items-center space-x-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium transition-all shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Retry Connection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
