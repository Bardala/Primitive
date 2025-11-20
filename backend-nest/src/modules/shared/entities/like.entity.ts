import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('likes')
export class Like {
  @PrimaryColumn('char', { length: 36 })
  blogId: string;

  @PrimaryColumn('char', { length: 36 })
  userId: string;

  @ManyToOne(() => Blog, (blog) => blog.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
