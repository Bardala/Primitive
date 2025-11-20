import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Space } from './space.entity';

export enum PermissionType {
  POST_BLOG = 'post_blog',
  SEND_CHAT = 'send_chat',
}

export enum AllowedRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  EVERYONE = 'everyone',
}

@Entity('space_permissions')
export class SpacePermission {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('char', { length: 36 })
  spaceId: string;

  @Column({
    type: 'enum',
    enum: PermissionType,
    default: PermissionType.POST_BLOG,
  })
  permission: PermissionType;

  @Column({
    type: 'enum',
    enum: AllowedRole,
    default: AllowedRole.MEMBER,
  })
  allowedRole: AllowedRole;

  @ManyToOne(() => Space, (space) => space.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  space: Space;
}
