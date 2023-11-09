import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserCounter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  count: number;
}
