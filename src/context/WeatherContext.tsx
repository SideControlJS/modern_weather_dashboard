import React, { createContext, useContext, useState, useEffect } from 'react';

type TempUnit = 'celsius' | 'fahrenheit';
type Location = { name?: string; lat?: number; lon?: number; };

interface WeatherContextType {
  tempUnit: TempUnit;
  toggleTempUnit: () => void;
  convertTemp: (celsius: number) => number;
  setLocation: (location: Location) => void;
  recentSearches: Array<{ name: string; timestamp: number; }>;
  favoriteLocations: Array<{ name: string; }>;
  addToFavorites: (name: string) => void;
  removeFromFavorites: (name: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const MAX_RECENT_SEARCHES = 5;

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tempUnit, setTempUnit] = useState<TempUnit>('celsius');
  const [recentSearches, setRecentSearches] = useState<Array<{ name: string; timestamp: number; }>>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<Array<{ name: string; }>>([]);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedUnit = localStorage.getItem('tempUnit');
    if (savedUnit) setTempUnit(savedUnit as TempUnit);

    const savedFavorites = localStorage.getItem('favoriteLocations');
    if (savedFavorites) setFavoriteLocations(JSON.parse(savedFavorites));

    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
  }, []);

  const toggleTempUnit = () => {
    const newUnit = tempUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTempUnit(newUnit);
    localStorage.setItem('tempUnit', newUnit);
  };

  const convertTemp = (celsius: number): number => {
    if (tempUnit === 'celsius') return celsius;
    return (celsius * 9/5) + 32;
  };

  const setLocation = (location: Location) => {
    if (location.name) {
      const newSearches = [
        { name: location.name, timestamp: Date.now() },
        ...recentSearches.filter(s => s.name !== location.name),
      ].slice(0, MAX_RECENT_SEARCHES);
      
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    }
  };

  const addToFavorites = (name: string) => {
    if (!favoriteLocations.some(loc => loc.name === name)) {
      const newFavorites = [...favoriteLocations, { name }];
      setFavoriteLocations(newFavorites);
      localStorage.setItem('favoriteLocations', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (name: string) => {
    const newFavorites = favoriteLocations.filter(loc => loc.name !== name);
    setFavoriteLocations(newFavorites);
    localStorage.setItem('favoriteLocations', JSON.stringify(newFavorites));
  };

  return (
    <WeatherContext.Provider value={{
      tempUnit,
      toggleTempUnit,
      convertTemp,
      setLocation,
      recentSearches,
      favoriteLocations,
      addToFavorites,
      removeFromFavorites,
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};