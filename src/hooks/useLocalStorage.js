import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with state sync
 */
export const useLocalStorage = (key, initialValue) => {
  // Get stored value
  const getStoredValue = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Sync with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          setStoredValue(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  // Custom setter that updates both state and localStorage
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Check if key exists
  const exists = useCallback(() => {
    return localStorage.getItem(key) !== null;
  }, [key]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    exists
  };
};

// Hook for managing multiple localStorage items
export const useLocalStorageMultiple = (items) => {
  const storage = {};
  
  items.forEach(({ key, initialValue }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    storage[key] = useLocalStorage(key, initialValue);
  });

  return storage;
};

// Hook for localStorage with validation
export const useLocalStorageWithValidation = (key, initialValue, validator) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        if (validator && !validator(parsed)) {
          return initialValue instanceof Function ? initialValue() : initialValue;
        }
        return parsed;
      }
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      if (validator && !validator(valueToStore)) {
        console.warn(`Invalid value for key "${key}":`, valueToStore);
        return;
      }
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, validator]);

  return { value: storedValue, setValue };
};

export default useLocalStorage;