import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class ProductCategory {
  @ApiProperty({ description: '카테고리 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '카테고리 이름',
    required: true,
    example: '명함',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '카테고리 이미지',
    required: false,
    example: 'https://www.printshop.com',
  })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ description: '태그가 연결된 제품', type: () => [Product] })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
