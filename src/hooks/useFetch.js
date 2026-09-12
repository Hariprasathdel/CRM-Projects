import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

/**
 * Custom hook for data fetching with loading, error, and abort support
 */
export const useFetch = (url, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    immediate = true,
    onSuccess = null,
    onError = null,
    dependencies = []
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0);
  
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = useCallback(async () => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: abortControllerRef.current.signal
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = body;
      }

      const response = await api({
        url,
        ...config
      });

      if (!isMountedRef.current) return;

      setData(response.data);
      setStatus(response.status);
      setError(null);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return { success: true, data: response.data };
    } catch (err) {
      if (!isMountedRef.current) return;

      // Don't set error if request was aborted
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setStatus(err.response?.status || 500);

      if (onError) {
        onError(errorMessage);
      }

      return { success: false, error: errorMessage };
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, [url, method, body, headers, onSuccess, onError]);

  // Refetch function
  const refetch = useCallback(() => {
    setRefetchIndex(prev => prev + 1);
  }, []);

  // Immediate fetch on mount or dependency change
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, method, body, immediate, refetchIndex, ...dependencies]);

  return {
    data,
    loading,
    error,
    status,
    refetch,
    fetchData,
    isSuccess: data !== null && !error,
    isError: error !== null,
    isLoading: loading
  };
};

// Hook for POST/PUT/PATCH requests
export const useMutation = (url, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (payload = {}, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        url,
        method: options.method || 'POST',
        data: payload,
        ...config
      });

      setData(response.data);
      
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);

      if (options.onError) {
        options.onError(errorMessage);
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { mutate, loading, error, data };
};

export default useFetch;