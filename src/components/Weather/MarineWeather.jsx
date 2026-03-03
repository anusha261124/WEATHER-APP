import React from 'react';
import { Waves, Droplets, Wind, Navigation, Thermometer, Anchor } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { useWeather } from '../../hooks/useWeather';
import { formatTemperature, formatSpeed, getWindDirection } from '../../utils/formatters';
import GlassCard from '../Layout/GlassCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

const MarineWeather = () => {
  const { currentLocation, units, error, setError } = useWeatherContext();
  const { data, refetch } = useWeather('marine', { query: currentLocation, units });

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

  const { current, location } = data;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full scrollbar-thin">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Waves className="w-6 h-6 text-cyan-400" />
            Marine Weather
          </h2>
          <p className="text-slate-400 mt-1">
            {location.name}, {location.country}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Anchor className="w-4 h-4" />
          <span>Marine Conditions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Waves className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="metric-label text-xs">Water Temperature</p>
              <p className="metric-value text-2xl">
                {current.water_temperature ? formatTemperature(current.water_temperature, units) : 'N/A'}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Surface water temperature at location
          </p>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <Wind className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <p className="metric-label text-xs">Wind Speed</p>
              <p className="metric-value text-2xl">
                {formatSpeed(current.wind_speed, units)}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Wind speed over water surface
          </p>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="metric-label text-xs">Wind Direction</p>
              <p className="metric-value text-2xl">
                {getWindDirection(current.wind_degree)}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            {current.wind_degree}° from North
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Waves className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="metric-label text-xs">Wave Height</p>
              <p className="metric-value">
                {current.wave_height || 'N/A'} m
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="metric-label text-xs">Humidity</p>
              <p className="metric-value">
                {current.humidity}%
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="metric-label text-xs">Air Temperature</p>
              <p className="metric-value">
                {formatTemperature(current.temperature, units)}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Marine Conditions Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Current Conditions</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Weather</span>
                <span className="text-white capitalize">
                  {current.weather_descriptions?.[0] || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Visibility</span>
                <span className="text-white">{current.visibility} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pressure</span>
                <span className="text-white">{current.pressure} mb</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cloud Cover</span>
                <span className="text-white">{current.cloudcover}%</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Location Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Coordinates</span>
                <span className="text-white">{location.lat}°, {location.lon}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timezone</span>
                <span className="text-white">{location.timezone_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Local Time</span>
                <span className="text-white">{location.localtime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Observation</span>
                <span className="text-white">{current.observation_time}</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {current.weather_icons?.[0] && (
        <div className="flex justify-center">
          <GlassCard className="text-center">
            <img 
              src={current.weather_icons[0]} 
              alt={current.weather_descriptions?.[0]}
              className="w-24 h-24 mx-auto"
            />
            <p className="text-slate-300 capitalize mt-2">
              {current.weather_descriptions?.[0]}
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default MarineWeather;
