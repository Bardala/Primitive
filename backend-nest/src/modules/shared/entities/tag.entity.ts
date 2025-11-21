import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Space } from 'src/modules/space/entities/space.entity';

@Entity('tags')
export class Tag {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column({ unique: true, length: 100 })
  name!: string;

  @ManyToMany(() => Blog, (blog) => blog.tags)
  blogs!: Blog[];

  @ManyToMany(() => Space, (space) => space.tags)
  spaces!: Space[];

  @ManyToMany(() => User, (user) => user.tags)
  users!: User[];
}
