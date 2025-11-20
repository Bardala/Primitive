import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { BlogSeriesLink } from './blog-series-links.entity';

@Entity('blog_series')
export class BlogSeries {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('char', { length: 36 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  // Unsafe return of a value of type error.eslint@typescript-eslint/no-unsafe-return
  @OneToMany(() => BlogSeriesLink, (link) => link.series)
  blogLinks: BlogSeriesLink[];
}
