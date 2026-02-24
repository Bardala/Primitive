import React, { useState } from 'react';

import { useAddBlogToSeries, useRemoveBlogFromSeries, useUserSeries } from '../hooks/useSeries';

// import '../styles/series.css';

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
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          currentSeriesId
            ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50'
            : 'bg-surface-light text-text-secondary-light ring-1 ring-border-light hover:bg-gray-50 hover:text-primary-600 dark:bg-surface-dark dark:text-text-secondary-dark dark:ring-border-dark dark:hover:bg-primary-900/10 dark:hover:text-primary-400'
        }`}
      >
        {currentSeriesId ? '📚 In Series' : '➕ Add to Series'}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-2 min-w-[200px] overflow-hidden rounded-lg border border-border-light bg-surface-light shadow-lg ring-1 ring-black/5 dark:border-border-dark dark:bg-surface-dark dark:ring-white/5">
            {currentSeriesId && (
              <button
                onClick={handleRemoveFromSeries}
                className="w-full border-b border-border-light px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:border-border-dark dark:text-red-400 dark:hover:bg-red-900/10"
              >
                Remove from current series
              </button>
            )}

            <div className="max-h-48 overflow-y-auto py-1 custom-scrollbar">
              {seriesData.series
                .filter(s => s.id !== currentSeriesId)
                .map(series => (
                  <button
                    key={series.id}
                    onClick={() => handleAddToSeries(series.id)}
                    className="block w-full px-4 py-2 text-left text-sm text-text-primary-light hover:bg-gray-50 hover:text-primary-600 dark:text-text-primary-dark dark:hover:bg-primary-900/10 dark:hover:text-primary-400"
                  >
                    {series.name}
                  </button>
                ))}

              {seriesData.series.filter(s => s.id !== currentSeriesId).length === 0 && (
                <div className="px-4 py-2 text-sm italic text-text-secondary-light dark:text-text-secondary-dark">
                  No other series available
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
