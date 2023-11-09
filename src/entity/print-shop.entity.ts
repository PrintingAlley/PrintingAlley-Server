import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { PrintShopReview } from './print-shop-review.entity';
import { User } from './user.entity';

@Entity()
export class PrintShop {
  @ApiProperty({
    description: '인쇄사 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '상호명',
    required: true,
    example: '모든인쇄',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '주소',
    required: true,
    example: '서울시 강남구',
  })
  @Column()
  address: string;

  @ApiProperty({
    description: '전화번호',
    required: true,
    example: '02-123-4567',
  })
  @Column()
  phone: string;

  @ApiProperty({
    description: '이메일',
    required: true,
    example: 'abc@gmail.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: '홈페이지',
    required: false,
    example: 'https://www.printshop.com',
  })
  @Column({ nullable: true })
  homepage?: string;

  @ApiProperty({
    description: '대표자명',
    required: true,
    example: '홍길동',
  })
  @Column()
  representative: string;

  @ApiProperty({
    description: '인쇄사 소개',
    required: true,
    example: '인쇄사 소개',
  })
  @Column({ type: 'text' })
  introduction: string;

  @ApiProperty({
    description: '인쇄사 로고 이미지',
    required: false,
    example: 'https://www.printshop.com/image1.jpg',
  })
  @Column({ nullable: true })
  logoImage?: string;

  @ApiProperty({
    description: '인쇄사 배경 이미지',
    required: false,
    example: 'https://www.printshop.com/image1.jpg',
  })
  @Column({ nullable: true })
  backgroundImage?: string;

  @ApiProperty({
    description: '위도',
    required: true,
    example: '37.123456',
  })
  @Column()
  latitude: string;

  @ApiProperty({
    description: '경도',
    required: true,
    example: '127.123456',
  })
  @Column()
  longitude: string;

  @ApiProperty({
    description: '사장님',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.printShops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: '사장님 ID', example: 1 })
  @Column({
    select: false,
    nullable: true,
    insert: false,
    update: false,
    default: 0,
  })
  ownerId?: number;

  @ApiProperty({
    description: '제품 목록',
    type: () => [Product],
  })
  @OneToMany(() => Product, (product) => product.printShop)
  products: Product[];

  @ApiProperty({ description: '리뷰 목록', type: () => [PrintShopReview] })
  @OneToMany(() => PrintShopReview, (review) => review.printShop)
  reviews: PrintShopReview[];

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
