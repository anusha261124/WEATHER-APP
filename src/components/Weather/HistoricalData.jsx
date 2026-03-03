import React, { useState } from 'react';
import { History, Calendar, Thermometer, Droplets, Wind, Sun, Search } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { useWeather } from '../../hooks/useWeather';
import { formatTemperature, formatSpeed, formatDate } from '../../utils/formatters';
import GlassCard from '../Layout/GlassCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

const HistoricalData = () => {
  const { currentLocation, units, error, setError } = useWeatherContext();
  const [selectedDate, setSelectedDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  });
  
  const { data, refetch } = useWeather('historical', { 
    query: currentLocation, 
    date: selectedDate, 
    units 
  });

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSearch = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={() => { setError(null); refetch(); }} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full scrollbar-thin">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            Historical Weather
          </h2>
          <p className="text-slate-400 mt-1">
            View past weather data for any date
          </p>
        </div>
      </div>

      <GlassCard>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              Select Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full glass-input pl-10 pr-4 py-2.5"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="glass-button px-6 py-2.5 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </GlassCard>

      {!data && !error && (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" />
        </div>
      )}

      {data && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{data.location.name}</h3>
              <p className="text-slate-400">
                {formatDate(selectedDate, 'EEEE, MMMM do, yyyy')}
              </p>
            </div>
          </div>

          {data.historical && data.historical[selectedDate] && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="text-center">
                  <Thermometer className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                  <p className="metric-label text-xs mb-1">Average Temperature</p>
                  <p className="metric-value text-2xl">
                    {formatTemperature(data.historical[selectedDate].avgtemp, units)}
                  </p>
                </GlassCard>

                <GlassCard className="text-center">
                  <Sun className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <p className="metric-label text-xs mb-1">Max Temperature</p>
                  <p className="metric-value text-2xl">
                    {formatTemperature(data.historical[selectedDate].maxtemp, units)}
                  </p>
                </GlassCard>

                <GlassCard className="text-center">
                  <Thermometer className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <p className="metric-label text-xs mb-1">Min Temperature</p>
                  <p className="metric-value text-2xl">
                    {formatTemperature(data.historical[selectedDate].mintemp, units)}
                  </p>
                </GlassCard>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="metric-label text-xs">Humidity</p>
                      <p className="metric-value">
                        {data.historical[selectedDate].avghumidity}%
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                      <Wind className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="metric-label text-xs">Wind Speed</p>
                      <p className="metric-value">
                        {formatSpeed(data.historical[selectedDate].maxwind || 0, units)}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="metric-label text-xs">UV Index</p>
                      <p className="metric-value">
                        {data.historical[selectedDate].uv_index || 0}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                      <History className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="metric-label text-xs">Visibility</p>
                      <p className="metric-value">
                        {data.historical[selectedDate].avgvis || 10} km
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {data.historical[selectedDate].hourly && (
                <GlassCard>
                  <h4 className="text-lg font-semibold text-white mb-4">Hourly Data</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-400 border-b border-white/10">
                          <th className="text-left py-2 px-3">Time</th>
                          <th className="text-left py-2 px-3">Temp</th>
                          <th className="text-left py-2 px-3">Weather</th>
                          <th className="text-left py-2 px-3">Humidity</th>
                          <th className="text-left py-2 px-3">Wind</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.historical[selectedDate].hourly
                          .filter((_, i) => i % 3 === 0)
                          .map((hour, index) => (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-2 px-3 text-slate-300">{hour.time}</td>
                              <td className="py-2 px-3 text-white font-medium">
                                {formatTemperature(hour.temperature, units)}
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-2">
                                  {hour.weather_icons?.[0] && (
                                    <img src={hour.weather_icons[0]} alt="" className="w-6 h-6" />
                                  )}
                                  <span className="text-slate-300 capitalize">
                                    {hour.weather_descriptions?.[0]}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2 px-3 text-slate-300">{hour.humidity}%</td>
                              <td className="py-2 px-3 text-slate-300">
                                {formatSpeed(hour.wind_speed, units)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoricalData;
