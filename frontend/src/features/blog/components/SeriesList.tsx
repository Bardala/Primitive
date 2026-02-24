import React from 'react';

import { useUserSeries } from '../hooks/useSeries';

// import '../styles/series.css';

interface SeriesListProps {
  onSelectSeries: (seriesId: string) => void;
}

export const SeriesList: React.FC<SeriesListProps> = ({ onSelectSeries }) => {
  const { data, isLoading } = useUserSeries();

  if (isLoading)
    return (
      <div className="p-4 text-center text-text-secondary-light dark:text-text-secondary-dark">
        Loading series...
      </div>
    );
  if (!data?.series.length)
    return (
      <div className="p-4 text-center text-text-secondary-light dark:text-text-secondary-dark">
        No series found.
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-4">
      {data.series.map(series => (
        <div
          key={series.id}
          className="cursor-pointer rounded-lg border border-border-light bg-surface-light p-4 shadow-sm transition-colors hover:bg-gray-50 hover:shadow-md dark:border-border-dark dark:bg-surface-dark dark:hover:bg-primary-900/10"
          onClick={() => onSelectSeries(series.id)}
        >
          <div className="mb-2 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            {series.name}
          </div>
          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Created at: {new Date(series.createdAt!).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};
