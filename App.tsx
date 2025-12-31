
import React, { useState, useEffect, useCallback } from 'react';
import { FocusSession, TaskCategory } from './types';
import { Pomodoro } from './components/Pomodoro';
import { Dashboard } from './components/Dashboard';
import { analyzeProductivity } from './services/geminiService';

// Mock data for initial demo
const MOCK_SESSIONS: FocusSession[] = [
  { id: '1', startTime: Date.now() - 3600000 * 2, endTime: Date.now() - 3600000 * 1.5, duration: 1800, category: TaskCategory.STUDY, taskName: 'Math Homework', distractions: 2 },
  { id: '2', startTime: Date.now() - 3600000 * 1.4, endTime: Date.now() - 3600000 * 1.2, duration: 1200, category: TaskCategory.CODING, taskName: 'React Refactoring', distractions: 0 },
  { id: '3', startTime: Date.now() - 3600000 * 1, endTime: Date.now() - 3600000 * 0.8, duration: 600, category: TaskCategory.DISTRACTION, taskName: 'Social Media Scroll', distractions: 1 },
];

const App: React.FC = () => {
  const [sessions, setSessions] = useState<FocusSession[]>(MOCK_SESSIONS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tracker' | 'insights'>('tracker');

  const handleSessionComplete = (session: FocusSession) => {
    setSessions(prev => [session, ...prev]);
  };

  const getAIAdvice = async () => {
    if (sessions.length === 0) return;
    setIsAnalyzing(true);
    try {
      const insight = await analyzeProductivity(sessions);
      setAiInsight(insight);
      setActiveTab('insights');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">FocusFlow</h1>
        </div>
        
        <nav className="flex bg-slate-800 rounded-full p-1">
          <button 
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'tracker' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'insights' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            AI Coach
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {activeTab === 'tracker' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tracker Section */}
              <div className="md:col-span-1">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  Focus Timer
                </h2>
                <Pomodoro onSessionComplete={handleSessionComplete} />
                
                <div className="mt-8 p-6 bg-slate-800/40 rounded-2xl border border-slate-700">
                  <h3 className="font-semibold text-slate-200 mb-2">Pro Tip</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Leaving this tab during a session counts as a "Focus Slip". Try to stay on track to improve your productivity score!
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="md:col-span-2 space-y-8">
                <div className="flex justify-between items-end">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                    Stats & Analytics
                  </h2>
                  <button 
                    onClick={getAIAdvice}
                    disabled={isAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg active:scale-95"
                  >
                    {isAnalyzing ? (
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                    )}
                    Generate AI Insight
                  </button>
                </div>

                <Dashboard sessions={sessions} />

                {/* Session List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-300">Recent Sessions</h3>
                  <div className="space-y-3">
                    {sessions.map(session => (
                      <div key={session.id} className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-10 rounded-full ${session.category === TaskCategory.STUDY ? 'bg-indigo-500' : session.category === TaskCategory.DISTRACTION ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                          <div>
                            <p className="font-semibold text-slate-100">{session.taskName}</p>
                            <p className="text-xs text-slate-500 font-mono">{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-mono text-slate-200">{Math.floor(session.duration / 60)}m</p>
                          <p className="text-xs text-rose-400">{session.distractions} focus slips</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto py-10">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM5.884 6.607a1 1 0 01-.226 1.396l-.867.65a1 1 0 11-1.196-1.592l.867-.65a1 1 0 011.422.196zM15.183 6.607a1 1 0 011.422-.196l.867.65a1 1 0 11-1.196 1.592l-.867-.65a1 1 0 01-.226-1.396zM3.707 11.105a1 1 0 01.316 1.375l-.553.921a1 1 0 11-1.714-1.028l.553-.921a1 1 0 011.398-.347zM17.67 11.105a1 1 0 011.398.347l.553.921a1 1 0 11-1.714 1.028l-.553-.921a1 1 0 01.316-1.375zM9.63 16a1 1 0 112 0v1a1 1 0 11-2 0v-1zM5.658 15.008a1 1 0 011.397.347l.553.921a1 1 0 11-1.714 1.028l-.553-.921a1 1 0 01.347-1.397zM15.658 15.008a1 1 0 01.347 1.397l-.553.921a1 1 0 11-1.714-1.028l.553-.921a1 1 0 011.397-.347z" /></svg>
              AI Productivity Coach
            </h2>
            
            {aiInsight ? (
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-indigo-500/20 shadow-2xl prose prose-invert prose-indigo max-w-none">
                <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-light text-lg">
                  {aiInsight.split('\n').map((line, i) => (
                    <p key={i} className="mb-4">
                      {line.startsWith('#') ? <span className="text-2xl font-bold text-indigo-400">{line.replace(/#/g, '')}</span> : line}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
                <p className="text-slate-500 mb-6">No insights generated yet. Let Gemini analyze your sessions to give you a custom plan.</p>
                <button 
                  onClick={getAIAdvice}
                  disabled={isAnalyzing}
                  className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-2xl font-bold transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isAnalyzing ? "Processing with Gemini..." : "Analyze My Data Now"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Active Timer (Mobile optimization) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 md:hidden">
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
        <span className="font-mono text-white font-bold">FocusFlow Active</span>
      </div>
    </div>
  );
};

export default App;
