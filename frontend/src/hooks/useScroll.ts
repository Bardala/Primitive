import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useScroll = (query: UseInfiniteQueryResult) => {
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        query.fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
};
