import React from 'react';

import { useUserSeries } from '../hooks/useSeries';

import '../styles/series.css';

interface SeriesListProps {
  onSelectSeries: (seriesId: string) => void;
}

export const SeriesList: React.FC<SeriesListProps> = ({ onSelectSeries }) => {
  const { data, isLoading } = useUserSeries();

  if (isLoading) return <div>Loading series...</div>;
  if (!data?.series.length) return <div>No series found.</div>;

  return (
    <div className="series-list">
      {data.series.map(series => (
        <div
          key={series.id}
          className="series-list__item"
          onClick={() => onSelectSeries(series.id)}
        >
          <div className="series-list__title">{series.name}</div>
          <div className="series-list__meta">
            Created at: {new Date(series.createdAt!).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};
