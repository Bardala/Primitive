import { PrimaryColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
