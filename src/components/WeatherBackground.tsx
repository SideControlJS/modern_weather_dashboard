import React from 'react';

interface WeatherBackgroundProps {
  condition: string;
  temp?: number;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition, temp = 20 }) => {
  const getBackgroundClass = (condition: string, temperature: number) => {
    const isWarm = temperature >= 24;
    const isCold = temperature <= 10;

    const conditions: Record<string, string> = {
      'Clear': isWarm
        ? 'from-amber-300/20 via-orange-400/20 to-yellow-300/20'
        : isCold
        ? 'from-blue-200/20 via-sky-300/20 to-indigo-200/20'
        : 'from-sky-300/20 via-blue-300/20 to-indigo-300/20',
      'Clouds': 'from-slate-400/30 via-gray-500/30 to-zinc-400/30',
      'Rain': temperature <= 2
        ? 'from-blue-700/30 via-indigo-800/30 to-slate-700/30'
        : 'from-cyan-500/30 via-blue-600/30 to-indigo-500/30',
      'Snow': 'from-blue-50/30 via-slate-100/30 to-gray-100/30',
      'Thunderstorm': 'from-slate-800/40 via-purple-900/40 to-gray-900/40',
      'Drizzle': 'from-blue-300/30 via-cyan-400/30 to-sky-300/30',
      'Mist': 'from-gray-300/30 via-slate-400/30 to-zinc-300/30',
      'Haze': isWarm
        ? 'from-orange-200/30 via-amber-300/30 to-yellow-200/30'
        : 'from-gray-300/30 via-slate-400/30 to-zinc-300/30',
      'Dust': 'from-yellow-600/30 via-orange-500/30 to-amber-600/30',
      'Fog': 'from-gray-400/30 via-slate-500/30 to-zinc-400/30',
      'Sand': 'from-yellow-500/30 via-orange-400/30 to-amber-500/30',
      'Ash': 'from-gray-600/30 via-slate-700/30 to-zinc-600/30',
      'Squall': 'from-blue-700/30 via-indigo-800/30 to-slate-900/30',
      'Tornado': 'from-slate-900/30 via-gray-800/30 to-zinc-900/30',
    };
    return conditions[condition] || 'from-blue-400/20 via-cyan-500/20 to-sky-400/20';
  };

  return (
    <div className={`fixed inset-0 -z-10 animate-gradient-xy bg-gradient-to-br ${getBackgroundClass(condition, temp)}`}>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505533321630-975218a5f66f')] bg-cover bg-center bg-no-repeat opacity-10"></div>
    </div>
  );
};