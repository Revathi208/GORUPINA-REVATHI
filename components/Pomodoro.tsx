
import React, { useState, useEffect, useRef } from 'react';
import { TaskCategory, FocusSession } from '../types';

interface PomodoroProps {
  onSessionComplete: (session: FocusSession) => void;
}

export const Pomodoro: React.FC<PomodoroProps> = ({ onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.STUDY);
  const [distractions, setDistractions] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Fix: Use number type for timer reference in browser environments instead of NodeJS.Timeout
  const timerRef = useRef<number | null>(null);

  // Distraction tracking via Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isActive) {
        setDistractions(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]);

  const toggleTimer = () => {
    if (!isActive) {
      if (!taskName) {
        alert("Please enter a task name before starting.");
        return;
      }
      setStartTime(Date.now());
      setIsActive(true);
    } else {
      stopSession();
    }
  };

  const stopSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);

    if (startTime) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const session: FocusSession = {
        id: Math.random().toString(36).substr(2, 9),
        startTime,
        endTime: Date.now(),
        duration: elapsed,
        category,
        taskName,
        distractions
      };
      onSessionComplete(session);
    }
    
    // Reset
    setTimeLeft(25 * 60);
    setDistractions(0);
    setStartTime(null);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      // Fix: Use window.setInterval to ensure returning a number identifier
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      stopSession();
      alert("Session completed! Take a break.");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-indigo-900/30 p-8 rounded-3xl border border-indigo-500/30 shadow-2xl backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
      </div>

      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="text-7xl font-mono font-bold text-white tracking-tighter tabular-nums drop-shadow-md">
          {formatTime(timeLeft)}
        </div>

        <div className="w-full space-y-4">
          <input 
            type="text" 
            placeholder="What are you working on?" 
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            disabled={isActive}
            className="w-full bg-slate-900/50 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
          />
          
          <div className="flex gap-2">
            {(Object.values(TaskCategory)).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                disabled={isActive}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  category === cat 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                } ${isActive && category !== cat ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={toggleTimer}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
            isActive 
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
          } shadow-xl`}
        >
          {isActive ? (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Stop Session
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              Start Focus
            </>
          )}
        </button>

        {isActive && (
          <div className="flex items-center gap-2 text-rose-400 animate-pulse bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <span className="text-sm font-medium">{distractions} Focus Slips</span>
          </div>
        )}
      </div>
    </div>
  );
};
