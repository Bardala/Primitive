import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { UserActivity as IUserActivity } from '@nest/shared';

@Entity('user_activity')
export class UserActivity implements IUserActivity {
  @PrimaryColumn('char', { length: 36 })
  userId!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  lastActive!: Date;

  @OneToOne(() => User, (user) => user.activity)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
