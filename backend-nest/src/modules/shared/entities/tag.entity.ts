import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Space } from 'src/modules/space/entities/space.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true, length: 100 })
  name!: string;

  @ManyToMany(() => Blog, (blog) => blog.tags)
  blogs!: Blog[];

  @ManyToMany(() => Space, (space) => space.tags)
  spaces!: Space[];

  @ManyToMany(() => User, (user) => user.tags)
  users!: User[];

  /** Factory method to lowercase and trim "tag name" */
  static create(rawName: string): Tag {
    const tag = new Tag();
    tag.name = rawName.toLowerCase().trim();
    return tag;
  }
}
