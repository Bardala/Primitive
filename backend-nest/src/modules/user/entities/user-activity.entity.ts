import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_activity')
export class UserActivity {
  @PrimaryColumn('char', { length: 36 })
  userId: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  lastActive: Date;

  @OneToOne(() => User, (user) => user.activity)
  @JoinColumn({ name: 'userId' })
  user: User;
}
