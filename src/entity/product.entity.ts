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
import { ProductCategory } from './category.entity';
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
    description: '제품 가격 정보',
    required: false,
    example: '100장에 10,000원',
  })
  @Column({ nullable: true })
  priceInfo?: string;

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
    example: 'https://www.printshop.com',
  })
  @Column()
  mainImage: string;

  @ApiProperty({
    description: '제품 이미지들',
    required: true,
    example: ['https://www.printshop.com'],
  })
  @Column({ type: 'text', array: true })
  images: string[];

  @ApiProperty({
    description: '제품 카테고리',
    required: true,
    example: '명함',
  })
  @ManyToOne(() => ProductCategory, (category) => category.products)
  category: ProductCategory;

  @ApiProperty({
    description: '제품 제작 인쇄사',
    type: () => PrintShop,
  })
  @ManyToOne(() => PrintShop, (printShop) => printShop.products)
  printShop: PrintShop;

  @ApiProperty({ description: '리뷰 목록', type: () => [ProductReview] })
  @OneToMany(() => ProductReview, (review) => review.product)
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

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
