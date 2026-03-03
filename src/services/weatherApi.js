import axios from 'axios';

const BASE_URL = '/api';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Cache helpers
const getCacheKey = (endpoint, query, ...params) => {
  return `weather-${endpoint}-${query.toLowerCase()}-${params.join('-')}`;
};

const getCachedData = (cacheKey) => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        return parsed.data;
      }
      localStorage.removeItem(cacheKey);
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }
  return null;
};

const setCachedData = (cacheKey, data) => {
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.warn('Cache write error:', e);
  }
};

const handleResponse = (response) => {
  if (response.data.error) {
    const error = new Error(response.data.error.info || response.data.error || 'API Error');
    error.code = response.data.error.code;
    error.type = response.data.error.type;
    throw error;
  }
  return response.data;
};

const handleError = (error) => {
  if (error.code === 104 || (error.response?.data?.error?.code === 104)) {
    const rateLimitError = new Error('API limit reached. Please try again later.');
    rateLimitError.code = 104;
    rateLimitError.isRateLimit = true;
    throw rateLimitError;
  }
  
  if (error.response) {
    const { data } = error.response;
    if (data && data.error) {
      const apiError = new Error(data.error.info || data.error || `Error ${data.error.code}: API request failed`);
      apiError.code = data.error.code;
      throw apiError;
    }
  }
  
  const networkError = new Error(error.message || 'Network error occurred');
  networkError.isNetworkError = true;
  throw networkError;
};

export const weatherApi = {
  getCurrent: async (query, units = 'm') => {
    const cacheKey = getCacheKey('current', query, units);
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get('/weather', {
        params: {
          endpoint: 'current',
          location: query,
          units,
        },
      });
      const data = handleResponse(response);
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  getForecast: async (query, days = 7, units = 'm') => {
    const cacheKey = getCacheKey('forecast', query, days, units);
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get('/weather', {
        params: {
          endpoint: 'forecast',
          location: query,
          days,
          units,
        },
      });
      const data = handleResponse(response);
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  getHistorical: async (query, historicalDate, units = 'm') => {
    const cacheKey = getCacheKey('historical', query, historicalDate, units);
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get('/weather', {
        params: {
          endpoint: 'historical',
          location: query,
          date: historicalDate,
          units,
        },
      });
      const data = handleResponse(response);
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  getMarine: async (query, units = 'm') => {
    const cacheKey = getCacheKey('marine', query, units);
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get('/weather', {
        params: {
          endpoint: 'marine',
          location: query,
          units,
        },
      });
      const data = handleResponse(response);
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  getLocations: async (query) => {
    // No caching for autocomplete - needs to be fresh
    try {
      const response = await apiClient.get('/weather', {
        params: {
          endpoint: 'autocomplete',
          location: query,
        },
      });
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Clear all weather cache
  clearCache: () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('weather-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
  },
};

export default weatherApi;
