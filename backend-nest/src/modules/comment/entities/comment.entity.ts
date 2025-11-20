import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('char', { length: 36 })
  blogId: string;

  @Column('char', { length: 36 })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'bigint' })
  timestamp: number;

  // Relationships
  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
