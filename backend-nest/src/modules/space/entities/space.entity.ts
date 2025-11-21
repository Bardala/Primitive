import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { SpacePermission } from './space-permission.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { ChatMessage } from 'src/modules/chat/entities/chat-message.entity';
import { Tag } from 'src/modules/shared/entities/tag.entity';
import { Space as ISpace, type SpaceStatus } from '@nest/shared';

@Entity('spaces')
export class Space implements ISpace {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  status!: SpaceStatus;

  @Column({ name: 'ownerId', type: 'char', length: 36 })
  ownerId!: string;

  @Column({ length: 255 })
  description!: string;

  @Column({ type: 'bigint' })
  timestamp!: number;

  // Relationships
  @ManyToOne(() => User, (user) => user.ownedSpaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @OneToMany(() => Blog, (blog) => blog.space)
  blogs!: Blog[];

  @OneToMany(() => Member, (member) => member.space)
  members!: Member[];

  @OneToMany(() => SpacePermission, (permission) => permission.space)
  permissions!: SpacePermission[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.space)
  chatMessages!: ChatMessage[];

  @ManyToMany(() => Tag, (tag) => tag.spaces)
  @JoinTable({
    name: 'space_tags',
    joinColumn: { name: 'spaceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags!: Tag[];

  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;
}
