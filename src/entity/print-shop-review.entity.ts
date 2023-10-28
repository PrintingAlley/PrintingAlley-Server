import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrintShop } from './print-shop.entity';
import { User } from './user.entity';

@Entity()
export class PrintShopReview {
  @ApiProperty({
    description: '인쇄사 리뷰 ID',
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
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ApiProperty({
    description: '인쇄소',
    type: () => PrintShop,
  })
  @ManyToOne(() => PrintShop, (printShop) => printShop.id)
  printShop: PrintShop;

  @ApiProperty({ description: '좋아요 수', example: 1 })
  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
