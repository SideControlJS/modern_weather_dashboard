import { useState } from 'react';
import axios from 'axios';
import { Cloud, Loader2 } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { SearchBar } from './components/SearchBar';
import { WeatherBackground } from './components/WeatherBackground';
import { TemperatureToggle } from './components/TemperatureToggle';
import { WeatherEffects } from './components/WeatherEffects';
import { LocationFeatures } from './components/LocationFeatures';
import { TimeBasedInfo } from './components/TimeBasedInfo';
import { WeatherProvider } from './context/WeatherContext';
import type { WeatherData } from './types/weather';
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  throw new Error('Weather API key is missing. Please check your environment variables.');
}

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    try {
      setLoading(true);
      setError(null);

      const currentWeatherRes = await axios.get(
        `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      const { lat, lon } = currentWeatherRes.data.coord;
      const forecastRes = await axios.get(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      const formattedData: WeatherData = {
        current: {
          temp: currentWeatherRes.data.main.temp,
          humidity: currentWeatherRes.data.main.humidity,
          wind_speed: currentWeatherRes.data.wind.speed,
          weather: currentWeatherRes.data.weather,
          sunrise: currentWeatherRes.data.sys.sunrise,
          sunset: currentWeatherRes.data.sys.sunset,
          timezone: currentWeatherRes.data.timezone,
        },
        daily: forecastRes.data.list
          .filter((_: any, index: number) => index % 8 === 0)
          .slice(0, 5)
          .map((day: any) => ({
            dt: day.dt,
            temp: {
              min: day.main.temp_min,
              max: day.main.temp_max,
            },
            weather: day.weather,
          })),
      };

      setWeather(formattedData);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('City not found. Please try another location.');
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherProvider>
      <div className="relative min-h-screen overflow-hidden px-4 py-8 text-white">
        {weather && (
          <>
            <WeatherBackground condition={weather.current.weather[0].main} />
            <WeatherEffects condition={weather.current.weather[0].main} />
          </>
        )}
        
        <motion.div 
          className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_300px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <motion.h1 
                className="flex items-center gap-2 text-3xl font-bold"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Cloud className="h-8 w-8" />
                Weather Dashboard
              </motion.h1>
              
              <div className="flex w-full max-w-md items-center gap-4">
                <SearchBar onSearch={fetchWeather} />
                <TemperatureToggle />
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}

            {error && (
              <motion.div 
                className="rounded-lg bg-red-500/20 p-4 text-center backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
              >
                {error}
              </motion.div>
            )}

            {weather && (
              <div className="space-y-6">
                <WeatherCard
                  temp={weather.current.temp}
                  humidity={weather.current.humidity}
                  windSpeed={weather.current.wind_speed}
                  condition={weather.current.weather[0].main}
                  icon={weather.current.weather[0].icon}
                  isMain
                />

                {weather.current.sunrise && weather.current.sunset && (
                  <TimeBasedInfo
                    sunrise={weather.current.sunrise}
                    sunset={weather.current.sunset}
                    timezone={weather.current.timezone ?? 0}
                  />
                )}

                <motion.h2 
                  className="text-xl font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  5-Day Forecast
                </motion.h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {weather.daily.map((day) => (
                    <WeatherCard
                      key={day.dt}
                      temp={day.temp.max}
                      humidity={weather.current.humidity}
                      windSpeed={weather.current.wind_speed}
                      condition={day.weather[0].main}
                      icon={day.weather[0].icon}
                      date={day.dt}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <LocationFeatures />
          </div>
        </motion.div>
      </div>
    </WeatherProvider>
  );
}

export default App;