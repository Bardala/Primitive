import { FormEvent, useEffect } from 'react';

export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | FormEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) callback();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback, ref]);
};
