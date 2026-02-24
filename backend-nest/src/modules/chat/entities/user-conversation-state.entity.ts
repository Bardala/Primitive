import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserConversationState as IUserConversationState } from '@nest/shared';

export enum ConversationType {
  SPACE = 'space',
  PRIVATE = 'private',
}

@Entity('user_conversation_state')
@Index(['userId', 'conversationId', 'conversationType'], { unique: true })
@Index(['userId', 'conversationType'])
export class UserConversationState implements IUserConversationState {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column('char', { length: 36 })
  userId!: string;

  @Column('char', { length: 36 })
  conversationId!: string;

  @Column({
    type: 'enum',
    enum: ConversationType,
  })
  conversationType!: ConversationType;

  @Column({ type: 'timestamp', nullable: true })
  lastReadAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSoundPlayedAt!: Date;

  @Column({ type: 'boolean', default: false })
  isMuted!: boolean;

  // Relationships
  @ManyToOne(() => User, (user) => user.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // @CreateDateColumn()
  // createdAt!: Date;
}
