import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class PrintShop {
  @ApiProperty({
    description: '인쇄소 ID',
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
    required: true,
    example: 'https://www.printshop.com',
  })
  @Column()
  homepage: string;

  @ApiProperty({
    description: '대표자명',
    required: true,
    example: '홍길동',
  })
  @Column()
  representative: string;

  @ApiProperty({
    description: '인쇄소 소개',
    required: true,
    example: '인쇄소 소개',
  })
  @Column()
  introduction: string;

  @ApiProperty({
    description: '인쇄소 로고 이미지',
    required: true,
    example: 'https://www.printshop.com',
  })
  @Column()
  logoImage: string;

  @ApiProperty({
    description: '인쇄소 배경 이미지',
    required: true,
    example: 'https://www.printshop.com',
  })
  @Column()
  backgroundImage: string;

  @ApiProperty({
    description: '위도',
    required: true,
    example: 37.123456,
  })
  @Column({ type: 'real' })
  latitude: string;

  @ApiProperty({
    description: '경도',
    required: true,
    example: 127.123456,
  })
  @Column({ type: 'real' })
  longitude: string;

  @ApiProperty({ description: '인쇄소와 연관된 태그들', type: () => [Tag] })
  @ManyToMany(() => Tag, (tag) => tag.printShops)
  @JoinTable({
    name: 'print_shop_tags',
    joinColumn: {
      name: 'print_shop_id',
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
