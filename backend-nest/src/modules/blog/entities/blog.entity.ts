import { Like } from 'src/modules/shared/entities/like.entity';
import { Tag } from 'src/modules/shared/entities/tag.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'mediumtext' })
  content: string;

  @Column('char', { length: 36 })
  userId: string;

  @Column('char', { length: 36 })
  spaceId: string;

  @Column({ length: 255 })
  author: string;

  @Column({ type: 'bigint' })
  timestamp: number;

  // Relationships
  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Space, (space) => space.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.blog)
  likes: Like[];

  @ManyToMany(() => Tag, (tag) => tag.blogs)
  @JoinTable({
    name: 'blog_tags',
    joinColumn: { name: 'blogId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
