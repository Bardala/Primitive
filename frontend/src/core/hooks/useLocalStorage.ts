import { useState } from 'react';

import { LOCALS } from '../utils';

export function useLocalStorage<T>(
  key: keyof typeof LOCALS,
  defaultValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(LOCALS[key]);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${LOCALS[key]}":`, error);
      return defaultValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(LOCALS[key], JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${LOCALS[key]}":`, error);
    }
  };

  return [storedValue, setValue];
}
