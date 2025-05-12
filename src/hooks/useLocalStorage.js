import { useState, useEffect } from 'react';

export function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      // На сервере или в окружении без window
      return defaultValue;
    }
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch (err) {
      console.warn(`useLocalStorage: не удалось прочитать "${key}" из localStorage`, err);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.warn(`useLocalStorage: не удалось записать "${key}" в localStorage`, err);
    }
  }, [key, state]);

  return [state, setState];
}



export default useLocalStorage;
