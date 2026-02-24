import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('follows')
export class Follow {
  @PrimaryColumn('char', { length: 36 })
  followerId!: string;

  @PrimaryColumn('char', { length: 36 })
  followingId!: string;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followerId' })
  follower!: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followingId' })
  following!: User;
}
