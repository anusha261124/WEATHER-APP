import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Droplets, Wind } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { useWeather } from '../../hooks/useWeather';
import { formatTemperature, formatDayName, formatDate } from '../../utils/formatters';
import GlassCard from '../Layout/GlassCard';
import FilterDropdown from '../UI/FilterDropdown';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

const dayOptions = [
  { value: 3, label: '3 Days' },
  { value: 5, label: '5 Days' },
  { value: 7, label: '7 Days' },
  { value: 10, label: '10 Days' },
  { value: 14, label: '14 Days' },
];

const ForecastList = () => {
  const { currentLocation, units, error, setError } = useWeatherContext();
  const [forecastDays, setForecastDays] = useState(7);
  const { data, refetch } = useWeather('forecast', { 
    query: currentLocation, 
    days: forecastDays, 
    units 
  });

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={() => { setError(null); refetch(); }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const { forecast, location } = data;
  const forecastEntries = forecast ? Object.entries(forecast).sort() : [];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full scrollbar-thin">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            Weather Forecast
          </h2>
          <p className="text-slate-400 mt-1">
            {location.name}, {location.country}
          </p>
        </div>
        <FilterDropdown
          label="Forecast Period"
          value={forecastDays}
          options={dayOptions}
          onChange={setForecastDays}
          className="w-40"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {forecastEntries.map(([date, dayData], index) => (
          <GlassCard key={date} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full" />
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-semibold text-white">
                  {index === 0 ? 'Today' : formatDayName(date)}
                </p>
                <p className="text-xs text-slate-500">{formatDate(date, 'MMM do')}</p>
              </div>
              {dayData.weather_icons?.[0] && (
                <img 
                  src={dayData.weather_icons[0]} 
                  alt={dayData.weather_descriptions?.[0]}
                  className="w-12 h-12"
                />
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-white">
                {formatTemperature(dayData.maxtemp, units)}
              </span>
              <span className="text-lg text-slate-400">
                {formatTemperature(dayData.mintemp, units)}
              </span>
            </div>

            <p className="text-sm text-slate-300 capitalize mb-4">
              {dayData.weather_descriptions?.[0]}
            </p>

            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Droplets className="w-4 h-4" />
                  <span>Rain</span>
                </div>
                <span className="text-white">{dayData.chanceofrain || 0}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Wind className="w-4 h-4" />
                  <span>Wind</span>
                </div>
                <span className="text-white">{dayData.maxwind || dayData.avgwindspeed || 0} km/h</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">UV Index</span>
                <span className="text-white">{dayData.uv_index || 0}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Humidity</span>
                <span className="text-white">{dayData.avghumidity || 0}%</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {forecastEntries.length === 0 && (
        <GlassCard className="text-center py-12">
          <p className="text-slate-400">No forecast data available</p>
        </GlassCard>
      )}
    </div>
  );
};

export default ForecastList;
