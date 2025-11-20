import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('last_read')
export class LastRead {
  @PrimaryColumn('char', { length: 36 })
  userId: string;

  @PrimaryColumn('char', { length: 36 })
  spaceId: string;

  @PrimaryColumn('char', { length: 36 })
  lastReadId: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Space, (space) => space.chatMessages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @ManyToOne(() => ChatMessage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lastReadId' })
  lastReadMessage: ChatMessage;
}
