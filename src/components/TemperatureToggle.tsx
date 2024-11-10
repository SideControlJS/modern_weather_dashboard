import React from 'react';
import { Thermometer } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const TemperatureToggle: React.FC = () => {
  const { tempUnit, toggleTempUnit } = useWeather();

  return (
    <button
      onClick={toggleTempUnit}
      className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20"
    >
      <Thermometer className="h-4 w-4" />
      {tempUnit === 'celsius' ? '°C' : '°F'}
    </button>
  );
};