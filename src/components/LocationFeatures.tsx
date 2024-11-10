import React from 'react';
import { MapPin, Star, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';

export const LocationFeatures: React.FC = () => {
  const { setLocation, recentSearches, favoriteLocations, addToFavorites, removeFromFavorites } = useWeather();

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={getCurrentLocation}
        className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white backdrop-blur-md transition-all hover:bg-white/20"
      >
        <MapPin className="h-4 w-4" />
        Use Current Location
      </motion.button>

      {favoriteLocations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/80">Favorite Locations</h3>
          <div className="space-y-1">
            {favoriteLocations.map((location) => (
              <motion.button
                key={location.name}
                whileHover={{ scale: 1.02 }}
                className="flex w-full items-center justify-between rounded-lg bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-md transition-all hover:bg-white/10"
                onClick={() => setLocation({ name: location.name })}
              >
                <span>{location.name}</span>
                <Star
                  className="h-4 w-4 fill-current"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(location.name);
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {recentSearches.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/80">Recent Searches</h3>
          <div className="space-y-1">
            {recentSearches.map((search) => (
              <motion.button
                key={search.name}
                whileHover={{ scale: 1.02 }}
                className="flex w-full items-center justify-between rounded-lg bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-md transition-all hover:bg-white/10"
                onClick={() => setLocation({ name: search.name })}
              >
                <span>{search.name}</span>
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <Star
                    className={`h-4 w-4 cursor-pointer ${
                      favoriteLocations.some((loc) => loc.name === search.name)
                        ? 'fill-current'
                        : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavorites(search.name);
                    }}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};