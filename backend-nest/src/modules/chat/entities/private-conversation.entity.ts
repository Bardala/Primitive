import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { PrivateMessage } from './private-message.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { PrivateConversation as IPrivateConversation } from '@nest/shared';

// todo: Remove this entity, it's unnecessary, depend on a single PrivateMessage entity with two user references instead
@Entity('private_conversations')
export class PrivateConversation implements IPrivateConversation {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column('char', { length: 36 })
  user1Id!: string;

  @Column('char', { length: 36 })
  user2Id!: string;

  @CreateDateColumn()
  createdAt!: string;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user1Id' })
  user1!: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user2Id' })
  user2!: User;

  @OneToMany(() => PrivateMessage, (message) => message.conversation)
  messages!: PrivateMessage[];
}
