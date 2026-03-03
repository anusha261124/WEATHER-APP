import React, { createContext, useContext, useState, useCallback } from 'react';

const WeatherContext = createContext();

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState('New York');
  const [activeTab, setActiveTab] = useState('current');
  const [units, setUnits] = useState('m');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const addRecentSearch = useCallback((location) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== location.toLowerCase());
      const updated = [location, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  const value = {
    currentLocation,
    setCurrentLocation,
    activeTab,
    setActiveTab,
    units,
    setUnits,
    loading,
    setLoading,
    error,
    setError,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
