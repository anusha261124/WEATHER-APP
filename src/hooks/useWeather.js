import { useState, useEffect, useCallback, useRef } from 'react';
import { weatherApi } from '../services/weatherApi';
import { useWeatherContext } from '../context/WeatherContext';

const DEBOUNCE_MS = 800;

export const useWeather = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const { setLoading, setError } = useWeatherContext();
  const abortControllerRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!params.query || isFetchingRef.current) return;
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      let response;
      switch (endpoint) {
        case 'current':
          response = await weatherApi.getCurrent(params.query, params.units);
          break;
        case 'forecast':
          response = await weatherApi.getForecast(params.query, params.days, params.units);
          break;
        case 'historical':
          response = await weatherApi.getHistorical(params.query, params.date, params.units);
          break;
        case 'marine':
          response = await weatherApi.getMarine(params.query, params.units);
          break;
        default:
          throw new Error('Invalid endpoint');
      }
      
      // Only update if not aborted
      if (!abortControllerRef.current.signal.aborted) {
        setData(response);
        setError(null);
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        // Handle rate limit error specifically
        if (err.code === 104 || err.isRateLimit) {
          setError('API limit reached. Please try again later.');
        } else {
          setError(err.message || 'Network error. Please try again.');
        }
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [endpoint, params.query, params.days, params.date, params.units, setLoading, setError]);

  useEffect(() => {
    // Debounce the fetch
    const timeoutId = setTimeout(() => {
      fetchData();
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, refetch: fetchData };
};

export const useLocations = (searchTerm, debounceMs = 800) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await weatherApi.getLocations(searchTerm);
        if (response.data && !abortControllerRef.current.signal.aborted) {
          setSuggestions(response.data);
        }
      } catch (error) {
        if (!abortControllerRef.current.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!abortControllerRef.current.signal.aborted) {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchTerm, debounceMs]);

  return { suggestions, loading };
};

export default useWeather;
