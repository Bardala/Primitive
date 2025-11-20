import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Space } from 'src/modules/space/entities/space.entity';

@Entity('chat')
export class ChatMessage {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('char', { length: 36 })
  spaceId: string;

  @Column('char', { length: 36 })
  userId: string;

  @Column({ length: 255 })
  username: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'bigint' })
  timestamp: number;

  // Relationships
  @ManyToOne(() => User, (user) => user.chatMessages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Space, (space) => space.chatMessages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @CreateDateColumn()
  createdAt: Date;
}
