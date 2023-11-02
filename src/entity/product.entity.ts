import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { PrintShop } from './print-shop.entity';
import { ProductReview } from './product-review.entity';

@Entity()
export class Product {
  @ApiProperty({
    description: '제품 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '제품명',
    required: true,
    example: '특수컬러 명함',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '제품 크기',
    required: true,
    example: '90*50mm',
  })
  @Column()
  size: string;

  @ApiProperty({
    description: '종이 종류',
    required: true,
    example: '종이이름+평량(g)',
  })
  @Column()
  paper: string;

  @ApiProperty({
    description: '후가공',
    required: true,
    example: '도무송',
  })
  @Column()
  afterProcess: string;

  @ApiProperty({
    description: '디자이너 또는 디자인 스튜디오 이름',
    required: true,
    example: '프린팅 스튜디오',
  })
  @Column()
  designer: string;

  @ApiProperty({
    description: '제품 소개',
    required: true,
    example: '간단한 제품 소개',
  })
  @Column({ type: 'text' })
  introduction: string;

  @ApiProperty({
    description: '제품 설명',
    required: true,
    example: '제품 설명',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: '제품 메인 이미지',
    required: true,
    example: 'https://www.printshop.com/image1.jpg',
  })
  @Column()
  mainImage: string;

  @ApiProperty({
    description: '제품 이미지들',
    required: false,
    example: ['https://www.printshop.com/image1.jpg'],
  })
  @Column({ type: 'text', array: true, nullable: true })
  images?: string[];

  @ApiProperty({
    description: '제품 카테고리',
    required: true,
    example: '명함',
  })
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @ApiProperty({
    description: '제품 제작 인쇄사',
    type: () => PrintShop,
  })
  @ManyToOne(() => PrintShop, (printShop) => printShop.products, {
    onDelete: 'CASCADE',
  })
  printShop: PrintShop;

  @ApiProperty({ description: '리뷰 목록', type: () => [ProductReview] })
  @OneToMany(() => ProductReview, (review) => review.product, {
    onDelete: 'CASCADE',
  })
  reviews: ProductReview[];

  @ApiProperty({ description: '제품과 연관된 태그들', type: () => [Tag] })
  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'product_tags',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @ApiProperty({ description: '북마크 여부', example: false })
  @Column({
    select: false,
    nullable: true,
    insert: false,
    update: false,
    default: false,
  })
  isBookmarked?: boolean;

  @ApiProperty({ description: '북마크 수', example: 0 })
  @Column({
    select: false,
    nullable: true,
    insert: false,
    update: false,
    default: 0,
  })
  bookmarkCount?: number;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
