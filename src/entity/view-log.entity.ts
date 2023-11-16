import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ViewLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'print_shop_id', nullable: true })
  printShopId: number;

  @Column({ name: 'product_id', nullable: true })
  productId: number;

  @Column({ name: 'user_ip' })
  userIp: string;

  @CreateDateColumn()
  timestamp: Date;
}
