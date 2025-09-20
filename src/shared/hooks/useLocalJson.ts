import { useState, useCallback } from 'react';

export function useLocalJson<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : initial;
  });

  const save = useCallback((val: T) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  }, [key]);

  return [value, save] as const;
}
