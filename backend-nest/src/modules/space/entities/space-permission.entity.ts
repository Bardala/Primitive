import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Space } from './space.entity';
import {
  SpacePermission as ISpacePermission,
  SpacePermissionType,
  AllowedRole,
} from '@nest/shared';

@Entity('space_permissions')
export class SpacePermission implements ISpacePermission {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column('char', { length: 36 })
  spaceId!: string;

  @Column({
    type: 'enum',
    enum: SpacePermissionType,
    default: SpacePermissionType.POST_BLOG,
  })
  permission!: SpacePermissionType;

  @Column({
    type: 'enum',
    enum: AllowedRole,
    default: AllowedRole.MEMBER,
  })
  allowedRole!: AllowedRole;

  @ManyToOne(() => Space, (space) => space.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  space!: Space;
}
