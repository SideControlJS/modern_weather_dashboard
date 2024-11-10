import React from 'react';
import { Sun, Moon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface TimeBasedInfoProps {
  sunrise: number;
  sunset: number;
  timezone: number;
}

export const TimeBasedInfo: React.FC<TimeBasedInfoProps> = ({
  sunrise,
  sunset,
  timezone,
}) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const localTime = new Date(currentTime.getTime() + (timezone * 1000));
  const sunriseTime = new Date(sunrise * 1000);
  const sunsetTime = new Date(sunset * 1000);

  const isDaytime = currentTime > sunriseTime && currentTime < sunsetTime;

  const timelinePosition = (() => {
    const now = currentTime.getTime();
    const start = sunriseTime.getTime();
    const end = sunsetTime.getTime();
    const total = end - start;
    const current = now - start;
    return Math.max(0, Math.min(100, (current / total) * 100));
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-white/10 p-4 backdrop-blur-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span className="text-lg font-medium">
            {format(localTime, 'h:mm a')}
          </span>
        </div>
        {isDaytime ? (
          <Sun className="h-6 w-6 text-yellow-300" />
        ) : (
          <Moon className="h-6 w-6 text-blue-200" />
        )}
      </div>

      <div className="space-y-2">
        <div className="relative h-2 rounded-full bg-white/20">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-blue-400"
            initial={{ width: '0%' }}
            animate={{ width: `${timelinePosition}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <Sun className="h-4 w-4 text-yellow-300" />
            {format(sunriseTime, 'h:mm a')}
          </div>
          <div className="flex items-center gap-1">
            <Moon className="h-4 w-4 text-blue-200" />
            {format(sunsetTime, 'h:mm a')}
          </div>
        </div>
      </div>
    </motion.div>
  );
};