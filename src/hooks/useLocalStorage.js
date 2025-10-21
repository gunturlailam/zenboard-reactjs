import { useState, useEffect } from 'react';

/**
 * Custom hook untuk mengelola localStorage dengan React state
 * @param {string} key - Key untuk localStorage
 * @param {any} initialValue - Nilai default jika tidak ada di localStorage
 * @returns {[any, function]} - [value, setValue] seperti useState
 */
const useLocalStorage = (key, initialValue) => {
  // State untuk menyimpan nilai
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Ambil dari localStorage
      const item = window.localStorage.getItem(key);
      // Parse JSON atau return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Jika error, return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return wrapped version dari useState setter function yang persist ke localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen untuk perubahan localStorage dari tab/window lain
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    // Listen untuk storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

/**
 * Hook untuk mengelola multiple localStorage keys sekaligus
 * @param {Object} initialValues - Object dengan key-value pairs untuk localStorage
 * @returns {[Object, function]} - [values, setValues]
 */
export const useMultipleLocalStorage = (initialValues) => {
  const [values, setValues] = useState(() => {
    const stored = {};
    Object.keys(initialValues).forEach(key => {
      try {
        const item = window.localStorage.getItem(key);
        stored[key] = item ? JSON.parse(item) : initialValues[key];
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        stored[key] = initialValues[key];
      }
    });
    return stored;
  });

  const setMultipleValues = (newValues) => {
    setValues(prevValues => {
      const updatedValues = { ...prevValues, ...newValues };
      
      // Save each value to localStorage
      Object.keys(newValues).forEach(key => {
        try {
          if (updatedValues[key] === undefined) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(updatedValues[key]));
          }
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      });
      
      return updatedValues;
    });
  };

  return [values, setMultipleValues];
};

/**
 * Hook untuk mengelola localStorage dengan expiration time
 * @param {string} key - Key untuk localStorage
 * @param {any} initialValue - Nilai default
 * @param {number} expirationTime - Waktu expiration dalam milidetik
 * @returns {[any, function, function]} - [value, setValue, clearValue]
 */
export const useLocalStorageWithExpiry = (key, initialValue, expirationTime) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      const parsedItem = JSON.parse(item);
      
      // Check if item has expiry and if it's expired
      if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
        window.localStorage.removeItem(key);
        return initialValue;
      }
      
      return parsedItem.value || initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      const itemWithExpiry = {
        value: valueToStore,
        expiry: expirationTime ? Date.now() + expirationTime : null
      };
      
      window.localStorage.setItem(key, JSON.stringify(itemWithExpiry));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const clearValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, clearValue];
};

/**
 * Hook untuk clear semua localStorage
 * @returns {function} - Function untuk clear localStorage
 */
export const useClearLocalStorage = () => {
  const clearAll = () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  return clearAll;
};

export default useLocalStorage;