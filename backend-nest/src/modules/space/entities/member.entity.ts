import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Space } from './space.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { SpaceMember as IMember } from '@nest/shared';

@Entity('members')
export class Member implements IMember {
  @PrimaryColumn('char', { length: 36 })
  memberId!: string;

  @PrimaryColumn('char', { length: 36 })
  spaceId!: string;

  @Column({ default: false })
  isAdmin!: boolean;

  // Relationships
  @ManyToOne(() => User, (user) => user.spaceMemberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memberId' })
  user!: User;

  @ManyToOne(() => Space, (space) => space.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  space!: Space;
}
