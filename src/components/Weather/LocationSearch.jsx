import React, { useState } from 'react';
import { MapPin, Search, Clock, X, Star, History } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLocations } from '../../hooks/useWeather';
import GlassCard from '../Layout/GlassCard';
import LoadingSpinner from '../UI/LoadingSpinner';

const LocationSearch = () => {
  const { 
    currentLocation, 
    setCurrentLocation, 
    recentSearches, 
    addRecentSearch, 
    clearRecentSearches 
  } = useWeatherContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const { suggestions, loading } = useLocations(searchTerm);

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
    addRecentSearch(location);
    setSearchTerm('');
  };

  const popularLocations = [
    'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 
    'Dubai', 'Singapore', 'Barcelona', 'Rome', 'Amsterdam'
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full scrollbar-thin">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-cyan-400" />
          Location Search
        </h2>
        <p className="text-slate-400 mt-1">
          Search and explore weather for any location worldwide
        </p>
      </div>

      <GlassCard>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a city, region, or country..."
            className="w-full glass-input pl-12 pr-4 py-3 text-base"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {searchTerm.length >= 2 && (
          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="medium" />
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Search Results
                </p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(suggestion.name)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{suggestion.name}</p>
                      <p className="text-sm text-slate-400 truncate">
                        {suggestion.region && `${suggestion.region}, `}{suggestion.country}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      {suggestion.lat && (
                        <p>{suggestion.lat.toFixed(2)}°, {suggestion.lon?.toFixed(2)}°</p>
                      )}
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <p className="text-center text-slate-400 py-4">
                No locations found for &quot;{searchTerm}&quot;
              </p>
            )}
          </div>
        )}
      </GlassCard>

      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Searches
            </h3>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((location, index) => (
              <button
                key={index}
                onClick={() => setCurrentLocation(location)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentLocation === location
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'glass-button-secondary'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-amber-400" />
          Popular Locations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {popularLocations.map((location) => (
            <button
              key={location}
              onClick={() => handleLocationSelect(location)}
              className={`p-4 rounded-xl text-center transition-all ${
                currentLocation === location
                  ? 'bg-cyan-500/20 border border-cyan-500/30'
                  : 'glass-card hover:bg-white/10'
              }`}
            >
              <MapPin className={`w-5 h-5 mx-auto mb-2 ${
                currentLocation === location ? 'text-cyan-400' : 'text-slate-400'
              }`} />
              <p className={`text-sm font-medium ${
                currentLocation === location ? 'text-cyan-400' : 'text-slate-200'
              }`}>
                {location}
              </p>
            </button>
          ))}
        </div>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Current Selection</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{currentLocation}</p>
            <p className="text-slate-400">Selected for weather data</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default LocationSearch;
