import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookmarkGroup } from './bookmark-group.entity';
import { PrintShopReview } from './print-shop-review.entity';
import { ProductReview } from './product-review.entity';
import { PrintShop } from './print-shop.entity';
import { Product } from './product.entity';

export enum UserType {
  GENERAL = 'GENERAL',
  PRINTSHOP_OWNER = 'PRINTSHOP_OWNER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '소셜 로그인 제공업체',
    required: true,
    example: 'google',
  })
  @Column()
  provider: string;

  @ApiProperty({
    description: '유저 타입',
    required: true,
    enum: UserType,
  })
  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.GENERAL,
  })
  userType: UserType;

  @ApiProperty({
    description: '이름',
    required: false,
    example: '1번째 골목대장',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: '프로필 사진',
    required: false,
    example: 'https://www.printshop.com',
  })
  @Column({ nullable: true })
  profileImage?: string;

  @ApiProperty({
    description: '이메일',
    required: false,
    example: 'abc@gmail.com',
  })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({
    description: '소유 인쇄사 목록',
    type: [PrintShop],
  })
  @OneToMany(() => PrintShop, (printShop) => printShop.user)
  printShops: PrintShop[];

  @ApiProperty({
    description: '소유 제품 목록',
    type: [Product],
  })
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @ApiProperty({
    description: '작성한 인쇄사 리뷰 목록',
    type: [PrintShopReview],
  })
  @OneToMany(() => PrintShopReview, (printShopReview) => printShopReview.user)
  printShopReviews: PrintShopReview[];

  @ApiProperty({
    description: '작성한 제품 리뷰 목록',
    type: [PrintShopReview],
  })
  @OneToMany(() => ProductReview, (productReview) => productReview.user)
  productReviews: ProductReview[];

  @ApiProperty({ description: '북마크 그룹', type: [BookmarkGroup] })
  @OneToMany(() => BookmarkGroup, (group) => group.user)
  bookmarkGroups: BookmarkGroup[];

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;

  @Column({
    name: 'social_id',
    select: false,
  })
  socialId: string;

  @Column({
    name: 'access_token',
    select: false,
  })
  accessToken: string;

  @Column({
    name: 'real_name',
    select: false,
    nullable: true,
  })
  realName?: string;
}
