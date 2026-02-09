import React, { useState } from 'react';

import { useAddBlogToSeries, useRemoveBlogFromSeries, useUserSeries } from '../hooks/useSeries';

import '../styles/series.css';

interface AddToSeriesProps {
  blogId: string;
  currentSeriesId?: string;
}

export const AddToSeries: React.FC<AddToSeriesProps> = ({ blogId, currentSeriesId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: seriesData } = useUserSeries();
  const { mutate: addToSeries } = useAddBlogToSeries(currentSeriesId || '');
  const { mutate: removeFromSeries } = useRemoveBlogFromSeries(currentSeriesId || '');

  const handleAddToSeries = (seriesId: string) => {
    addToSeries(
      // TODO(Issue): get position from series
      { data: { blogId, position: 1 }, seriesId },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  const handleRemoveFromSeries = () => {
    if (currentSeriesId) {
      removeFromSeries(blogId, {
        onSuccess: () => {
          setIsOpen(false);
        },
      });
    }
  };

  if (!seriesData?.series.length) return null;

  return (
    <div className="add-to-series">
      <button onClick={() => setIsOpen(!isOpen)} className="add-to-series__toggle">
        {currentSeriesId ? '📚 In Series' : '➕ Add to Series'}
      </button>

      {isOpen && (
        <div className="add-to-series__dropdown">
          {currentSeriesId && (
            <button
              onClick={handleRemoveFromSeries}
              className="add-to-series__option add-to-series__option--remove"
            >
              Remove from current series
            </button>
          )}

          <div className="add-to-series__list">
            {seriesData.series
              .filter(s => s.id !== currentSeriesId)
              .map(series => (
                <button
                  key={series.id}
                  onClick={() => handleAddToSeries(series.id)}
                  className="add-to-series__option"
                >
                  {series.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
