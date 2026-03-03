import React from 'react';
import { 
  Droplets, 
  Wind, 
  Gauge, 
  Eye, 
  Sun, 
  Thermometer,
  Navigation,
  Clock
} from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { useWeather } from '../../hooks/useWeather';
import { 
  formatTemperature, 
  formatSpeed, 
  formatPressure, 
  formatDistance,
  formatDate,
  getWindDirection,
  getUVIndexLabel,
  getHumidityLabel
} from '../../utils/formatters';
import GlassCard from '../Layout/GlassCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

const MetricCard = ({ icon: Icon, label, value, subValue, color = 'cyan' }) => (
  <GlassCard padding="normal" className="flex items-start gap-4">
    <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-5 h-5 text-${color}-400`} />
    </div>
    <div>
      <p className="metric-label text-xs mb-1">{label}</p>
      <p className="metric-value text-lg">{value}</p>
      {subValue && <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>}
    </div>
  </GlassCard>
);

const CurrentWeather = () => {
  const { currentLocation, units, error, setError } = useWeatherContext();
  const { data, refetch } = useWeather('current', { query: currentLocation, units });

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
  const uvInfo = getUVIndexLabel(current.uv_index);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full scrollbar-thin">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{location.name}</h2>
          <p className="text-slate-400">
            {location.region && `${location.region}, `}{location.country}
          </p>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(location.localtime, 'EEEE, MMMM do, h:mm a')}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-3">
            {current.weather_icons?.[0] && (
              <img 
                src={current.weather_icons[0]} 
                alt={current.weather_descriptions?.[0]}
                className="w-16 h-16"
              />
            )}
            <div>
              <p className="text-5xl font-bold text-white">
                {formatTemperature(current.temperature, units)}
              </p>
              <p className="text-slate-300 capitalize">{current.weather_descriptions?.[0]}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Droplets}
          label="Humidity"
          value={`${current.humidity}%`}
          subValue={getHumidityLabel(current.humidity)}
          color="blue"
        />
        <MetricCard
          icon={Wind}
          label="Wind"
          value={formatSpeed(current.wind_speed, units)}
          subValue={`${getWindDirection(current.wind_degree)} ${current.wind_degree}°`}
          color="teal"
        />
        <MetricCard
          icon={Gauge}
          label="Pressure"
          value={formatPressure(current.pressure)}
          subValue={`${current.pressure > 1013 ? 'Rising' : 'Falling'}`}
          color="purple"
        />
        <MetricCard
          icon={Eye}
          label="Visibility"
          value={formatDistance(current.visibility, units)}
          subValue={current.visibility > 10 ? 'Excellent' : 'Good'}
          color="amber"
        />
        <MetricCard
          icon={Sun}
          label="UV Index"
          value={current.uv_index}
          subValue={uvInfo.label}
          color="orange"
        />
        <MetricCard
          icon={Thermometer}
          label="Feels Like"
          value={formatTemperature(current.feelslike, units)}
          subValue={`Actual: ${formatTemperature(current.temperature, units)}`}
          color="red"
        />
        <MetricCard
          icon={Navigation}
          label="Wind Direction"
          value={getWindDirection(current.wind_degree)}
          subValue={`${current.wind_degree}°`}
          color="cyan"
        />
        <MetricCard
          icon={Clock}
          label="Observation Time"
          value={current.observation_time}
          subValue="Local time"
          color="slate"
        />
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Location Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Latitude</p>
            <p className="text-white font-medium">{location.lat}°</p>
          </div>
          <div>
            <p className="text-slate-500">Longitude</p>
            <p className="text-white font-medium">{location.lon}°</p>
          </div>
          <div>
            <p className="text-slate-500">Timezone</p>
            <p className="text-white font-medium">{location.timezone_id}</p>
          </div>
          <div>
            <p className="text-slate-500">Local Time</p>
            <p className="text-white font-medium">{location.localtime}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default CurrentWeather;
