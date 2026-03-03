import { format, parseISO } from 'date-fns';

export const formatTemperature = (temp, units = 'm') => {
  const unitSymbol = units === 'm' ? '°C' : units === 'f' ? '°F' : 'K';
  return `${Math.round(temp)}${unitSymbol}`;
};

export const formatSpeed = (speed, units = 'm') => {
  const unitSymbol = units === 'm' ? 'km/h' : units === 'f' ? 'mph' : 'km/h';
  return `${Math.round(speed)} ${unitSymbol}`;
};

export const formatPressure = (pressure) => {
  return `${pressure} mb`;
};

export const formatDistance = (distance, units = 'm') => {
  const unitSymbol = units === 'm' ? 'km' : units === 'f' ? 'miles' : 'km';
  return `${distance} ${unitSymbol}`;
};

export const formatDate = (dateString, formatStr = 'EEEE, MMMM do') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  try {
    const date = parseISO(timeString);
    return format(date, 'h:mm a');
  } catch {
    return timeString;
  }
};

export const formatDayName = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'EEE');
  } catch {
    return dateString;
  }
};

export const getWeatherIconUrl = (iconCode) => {
  return iconCode || '';
};

export const getWindDirection = (degree) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
};

export const getUVIndexLabel = (uvIndex) => {
  if (uvIndex <= 2) return { label: 'Low', color: '#22c55e' };
  if (uvIndex <= 5) return { label: 'Moderate', color: '#eab308' };
  if (uvIndex <= 7) return { label: 'High', color: '#f97316' };
  if (uvIndex <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#a855f7' };
};

export const getHumidityLabel = (humidity) => {
  if (humidity < 30) return 'Dry';
  if (humidity < 60) return 'Comfortable';
  return 'Humid';
};
