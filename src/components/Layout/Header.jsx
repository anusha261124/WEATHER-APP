import React, { useState } from 'react';
import { Search, MapPin, Bell, User, X } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLocations } from '../../hooks/useWeather';

const Header = () => {
  const { currentLocation, setCurrentLocation, addRecentSearch } = useWeatherContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, loading } = useLocations(searchTerm);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentLocation(searchTerm.trim());
      addRecentSearch(searchTerm.trim());
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const locationName = suggestion.name;
    setCurrentLocation(locationName);
    addRecentSearch(locationName);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search location..."
            className="w-full glass-input pl-10 pr-10 py-2.5 text-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-card py-2 z-50">
              {loading ? (
                <div className="px-4 py-2 text-slate-400 text-sm">Loading...</div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center gap-2 text-sm text-slate-200"
                  >
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{suggestion.name}</span>
                    {suggestion.region && (
                      <span className="text-slate-500">, {suggestion.region}</span>
                    )}
                    {suggestion.country && (
                      <span className="text-slate-500">, {suggestion.country}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{currentLocation}</span>
        </div>
        
        <div className="h-6 w-px bg-white/10" />
        
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full" />
        </button>
        
        <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
