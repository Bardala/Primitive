import React from 'react';

import { useRemoveBlogFromSeries, useSeries } from '../hooks/useSeries';

import '../styles/series.css';

interface SeriesDetailProps {
  seriesId: string;
  onBack: () => void;
}

export const SeriesDetail: React.FC<SeriesDetailProps> = ({ seriesId, onBack }) => {
  const { data, isLoading } = useSeries(seriesId);
  const { mutate: removeBlog } = useRemoveBlogFromSeries(seriesId);

  if (isLoading) return <div>Loading series details...</div>;
  if (!data) return <div>Series not found.</div>;

  return (
    <div className="series-detail">
      <button onClick={onBack}>&larr; Back to List</button>

      <div className="series-detail__header">
        <h1>{data.series.name}</h1>
        <p>{data.series.description}</p>
      </div>

      <div className="series-detail__blogs">
        <h3>Blogs in this Series</h3>
        {data.blogs.map(blog => (
          <div key={blog.id} className="series-detail__blog-item">
            <div>
              <span className="series-detail__position">#{blog.position}</span>
              {blog.title}
            </div>
            <button onClick={() => removeBlog(blog.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};
