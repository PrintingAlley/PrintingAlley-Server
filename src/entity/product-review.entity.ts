import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class ProductReview {
  @ApiProperty({
    description: '제품 리뷰 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '리뷰 내용',
    required: true,
    example: '리뷰 내용입니다.',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    description: '별점',
    required: true,
    example: 4,
  })
  @Column({ type: 'int' })
  rating: number;

  @ApiProperty({
    description: '이미지 URL 배열',
    required: false,
    example: ['https://www.printshop.com'],
  })
  @Column({ type: 'text', array: true, nullable: true })
  images?: string[];

  @ApiProperty({
    description: '작성자',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty({
    description: '제품',
    type: () => Product,
  })
  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
