import { Blog } from 'src/modules/blog/entities/blog.entity';
import { ChatMessage } from 'src/modules/chat/entities/chat-message.entity';
import { Follow } from 'src/modules/shared/entities/follow.entity';
import { Like } from 'src/modules/shared/entities/like.entity';
import { Tag } from 'src/modules/shared/entities/tag.entity';
import { Member } from 'src/modules/space/entities/member.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Entity, Column, PrimaryColumn, OneToMany, OneToOne, JoinTable, ManyToMany } from 'typeorm';
import { UserActivity } from './user-activity.entity';

@Entity('users')
export class User {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column({ unique: true, length: 255 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'timestamp', type: 'bigint' })
  timestamp: number;

  // Relationships
  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Space, (space) => space.owner)
  ownedSpaces: Space[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chatMessages: ChatMessage[];

  @OneToMany(() => Member, (member) => member.user)
  spaceMemberships: Member[];

  // Following/Followers relationships (self-referencing)
  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToOne(() => UserActivity, (activity) => activity.user)
  // @JoinColumn({ name: 'userId' })
  activity: UserActivity;

  // In User entity, add this relationship
  @ManyToMany(() => Tag, (tag) => tag.users)
  @JoinTable({
    name: 'user_tags',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  // Optional: Add these columns if they exist in your actual database
  // @Column({ nullable: true, length: 255 })
  // avatarUrl?: string;

  // @Column({ nullable: true, type: 'text' })
  // bio?: string;

  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;
}
