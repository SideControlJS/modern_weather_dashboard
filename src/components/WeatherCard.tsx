import React from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { motion } from 'framer-motion';

interface WeatherCardProps {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  isMain?: boolean;
  date?: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temp,
  humidity,
  windSpeed,
  condition,
  icon,
  isMain = false,
  date,
}) => {
  const { convertTemp, tempUnit } = useWeather();
  const displayTemp = Math.round(convertTemp(temp));

  const getWeatherBackground = (condition: string, temperature: number) => {
    // Temperature thresholds in Celsius
    const isWarm = temperature >= 24; // ~75°F
    const isCold = temperature <= 10; // ~50°F

    const conditions: Record<string, string> = {
      'Clear': isWarm
        ? 'from-amber-300 via-orange-400 to-yellow-300' // Warm and sunny
        : isCold
        ? 'from-blue-200 via-sky-300 to-indigo-200' // Cold and clear
        : 'from-sky-300 via-blue-300 to-indigo-300', // Mild and clear
      'Clouds': 'from-slate-400 via-gray-500 to-zinc-400',
      'Rain': temperature <= 2
        ? 'from-blue-700 via-indigo-800 to-slate-700' // Near-freezing rain
        : 'from-cyan-500 via-blue-600 to-indigo-500',
      'Snow': 'from-blue-50 via-slate-100 to-gray-100',
      'Thunderstorm': 'from-slate-800 via-purple-900 to-gray-900',
      'Drizzle': 'from-blue-300 via-cyan-400 to-sky-300',
      'Mist': 'from-gray-300 via-slate-400 to-zinc-300',
      'Haze': isWarm
        ? 'from-orange-200 via-amber-300 to-yellow-200'
        : 'from-gray-300 via-slate-400 to-zinc-300',
      'Dust': 'from-yellow-600 via-orange-500 to-amber-600',
      'Fog': 'from-gray-400 via-slate-500 to-zinc-400',
      'Sand': 'from-yellow-500 via-orange-400 to-amber-500',
      'Ash': 'from-gray-600 via-slate-700 to-zinc-600',
      'Squall': 'from-blue-700 via-indigo-800 to-slate-900',
      'Tornado': 'from-slate-900 via-gray-800 to-zinc-900',
    };
    return conditions[condition] || 'from-blue-400 via-cyan-500 to-sky-400';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`group relative overflow-hidden rounded-xl backdrop-blur-md ${
        isMain ? 'col-span-full' : 'col-span-1'
      }`}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${getWeatherBackground(condition, temp)} opacity-75 transition-all duration-300 group-hover:opacity-90`} 
      />
      
      <div className="relative p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <motion.h2 
              className={`${isMain ? 'text-4xl' : 'text-2xl'} font-bold`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {displayTemp}°{tempUnit === 'celsius' ? 'C' : 'F'}
            </motion.h2>
            <p className="mt-1 text-lg capitalize">{condition}</p>
            {date && <p className="text-sm opacity-90">{formatDate(date)}</p>}
          </div>
          <motion.img 
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={condition}
            className={`${isMain ? 'h-20 w-20' : 'h-16 w-16'} drop-shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
        </div>
        
        <div className="mt-4 flex justify-between gap-4 text-sm">
          <motion.div 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <Wind size={18} />
            <span>{windSpeed} m/s</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <Droplets size={18} />
            <span>{humidity}%</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};