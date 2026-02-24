import React from 'react';

import { useRemoveBlogFromSeries, useSeries } from '../hooks/useSeries';

// import '../styles/series.css';

interface SeriesDetailProps {
  seriesId: string;
  onBack: () => void;
}

export const SeriesDetail: React.FC<SeriesDetailProps> = ({ seriesId, onBack }) => {
  const { data, isLoading } = useSeries(seriesId);
  const { mutate: removeBlog } = useRemoveBlogFromSeries(seriesId);

  if (isLoading)
    return (
      <div className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
        Loading series details...
      </div>
    );
  if (!data)
    return (
      <div className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
        Series not found.
      </div>
    );

  return (
    <div className="p-4 sm:p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-text-secondary-light hover:text-primary-600 dark:text-text-secondary-dark dark:hover:text-primary-400"
      >
        &larr; Back to List
      </button>

      <div className="mb-8 border-b border-border-light pb-6 dark:border-border-dark">
        <h1 className="mb-2 text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {data.series.name}
        </h1>
        {data.series.description && (
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
            {data.series.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="mb-2 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Blogs in this Series
        </h3>
        {data.blogs.length > 0 ? (
          data.blogs.map(blog => (
            <div
              key={blog.id}
              className="flex items-center justify-between rounded-lg border border-border-light bg-surface-light p-4 shadow-sm transition-colors hover:bg-gray-50 dark:border-border-dark dark:bg-surface-dark dark:hover:bg-primary-900/10"
            >
              <div className="flex items-center">
                <span className="mr-4 font-mono text-lg font-bold text-primary-600 dark:text-primary-400">
                  #{blog.position}
                </span>
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                  {blog.title}
                </span>
              </div>
              <button
                onClick={() => removeBlog(blog.id)}
                className="rounded-lg px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="italic text-text-secondary-light dark:text-text-secondary-dark">
            No blogs in this series yet.
          </p>
        )}
      </div>
    </div>
  );
};
