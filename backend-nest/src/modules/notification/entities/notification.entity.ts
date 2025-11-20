import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

export enum NotificationType {
  MESSAGE = 'message',
  MENTION = 'mention',
  COMMENT = 'comment',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('char', { length: 36 })
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column('char', { length: 36, nullable: true })
  refId: string;

  @Column({ type: 'json', nullable: true })
  payload: any;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
