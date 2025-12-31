
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import { FocusSession, TaskCategory } from '../types';

interface DashboardProps {
  sessions: FocusSession[];
}

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#94a3b8'];

export const Dashboard: React.FC<DashboardProps> = ({ sessions }) => {
  // Process data for Category Distribution
  // Fix: Explicitly type acc as Record<string, number> to ensure arithmetic operations on values are valid
  const categoryDataMap = sessions.reduce((acc: Record<string, number>, session) => {
    const catKey = session.category as string;
    const currentVal = acc[catKey] || 0;
    acc[catKey] = currentVal + session.duration;
    return acc;
  }, {});

  const pieData = Object.entries(categoryDataMap).map(([name, value]) => ({
    name,
    value: Math.round(value / 60) // in minutes
  }));

  // Process data for Timeline
  const timelineData = sessions.map((s, idx) => ({
    name: `S${idx + 1}`,
    minutes: Math.round(s.duration / 60),
    distractions: s.distractions
  }));

  const totalStudyMinutes = sessions
    .filter(s => s.category !== TaskCategory.DISTRACTION)
    .reduce((acc, s) => acc + s.duration, 0) / 60;

  const totalDistractionMinutes = sessions
    .filter(s => s.category === TaskCategory.DISTRACTION)
    .reduce((acc, s) => acc + s.duration, 0) / 60;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-indigo-300">Time Allocation (Mins)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-emerald-400">Focus Performance</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              />
              <Bar dataKey="minutes" fill="#818cf8" radius={[4, 4, 0, 0]} name="Session Mins" />
              <Bar dataKey="distractions" fill="#f87171" radius={[4, 4, 0, 0]} name="Tab Changes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-wrap justify-around items-center gap-8">
        <div className="text-center">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Total Focus</p>
          <p className="text-3xl font-bold text-indigo-400">{Math.round(totalStudyMinutes)}<span className="text-lg font-normal ml-1">min</span></p>
        </div>
        <div className="w-px h-12 bg-slate-700 hidden md:block"></div>
        <div className="text-center">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Distractions</p>
          <p className="text-3xl font-bold text-rose-400">{Math.round(totalDistractionMinutes)}<span className="text-lg font-normal ml-1">min</span></p>
        </div>
        <div className="w-px h-12 bg-slate-700 hidden md:block"></div>
        <div className="text-center">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Efficiency</p>
          <p className="text-3xl font-bold text-emerald-400">
            {totalStudyMinutes + totalDistractionMinutes > 0 
              ? Math.round((totalStudyMinutes / (totalStudyMinutes + totalDistractionMinutes)) * 100)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};
