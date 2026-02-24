import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PrivateConversation } from './private-conversation.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { PrivateMessage as IPrivateMessage } from '@nest/shared';

@Entity('private_messages')
export class PrivateMessage implements IPrivateMessage {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column('char', { length: 36 })
  conversationId!: string;

  @Column('char', { length: 36 })
  senderId!: string;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Relationships
  @ManyToOne(() => PrivateConversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation!: PrivateConversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender!: User;
}
