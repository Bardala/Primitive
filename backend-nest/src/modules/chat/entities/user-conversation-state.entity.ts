import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

export enum ConversationType {
  SPACE = 'space',
  PRIVATE = 'private',
}

@Entity('user_conversation_state')
export class UserConversationState {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('char', { length: 36 })
  userId: string;

  @Column('char', { length: 36 })
  conversationId: string;

  @Column({
    type: 'enum',
    enum: ConversationType,
  })
  conversationType: ConversationType;

  @Column({ type: 'timestamp', nullable: true })
  lastReadAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSoundPlayedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
