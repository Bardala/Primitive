import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Blog } from './blog.entity';
import { Tag } from 'src/modules/shared/entities/tag.entity';

@Entity('blog_tags')
export class BlogTag {
  @PrimaryColumn('char', { length: 36 })
  blogId!: string;

  @PrimaryColumn('char', { length: 36 })
  tagId!: string;

  @ManyToOne(() => Blog, (blog) => blog.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog!: Blog;

  @ManyToOne(() => Tag, (tag) => tag.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag!: Tag;
}
