import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Blog } from './blog.entity';
import { BlogSeries } from './blog-series.entity';

@Entity('blog_series_links')
@Unique(['seriesId', 'position'])
export class BlogSeriesLink {
  @PrimaryColumn('char', { length: 36 })
  seriesId: string;

  @PrimaryColumn('char', { length: 36 })
  blogId: string;

  @Column()
  position: number;

  // Relationships
  @ManyToOne(() => BlogSeries, (series) => series.blogLinks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seriesId' })
  series: BlogSeries;

  @ManyToOne(() => Blog, (blog) => blog.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;
}
