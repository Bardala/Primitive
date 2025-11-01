import { BlogSeries, BlogSeriesLink } from '@nest/shared';

export interface BlogSeriesDao {
  // Series operations
  createSeries(series: BlogSeries): Promise<void>;
  updateSeries(series: BlogSeries): Promise<void>;
  getSeries(seriesId: string): Promise<BlogSeries | undefined>;
  getUserSeries(userId: string): Promise<BlogSeries[]>;
  deleteSeries(seriesId: string): Promise<void>;

  // Series links
  addBlogToSeries(link: BlogSeriesLink): Promise<void>;
  removeBlogFromSeries(seriesId: string, blogId: string): Promise<void>;
  updateBlogPosition(seriesId: string, blogId: string, position: number): Promise<void>;
  getSeriesBlogs(seriesId: string): Promise<BlogSeriesLink[]>;
  getBlogSeries(blogId: string): Promise<BlogSeries[]>;
  getSeriesWithBlogs(
    seriesId: string
  ): Promise<{ series: BlogSeries; blogs: BlogSeriesLink[] } | undefined>;
}
