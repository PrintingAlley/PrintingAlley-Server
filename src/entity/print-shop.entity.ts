import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PrintShop {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '상호명',
    required: true,
    example: '프린트샵',
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
    description: '프린트샵 소개',
    required: true,
    example: '프린트샵 소개',
  })
  @Column()
  introduction: string;

  @ApiProperty({
    description: '프린트샵 로고 이미지',
    required: true,
    example: 'https://www.printshop.com',
  })
  @Column()
  logoImage: string;

  @ApiProperty({
    description: '프린트샵 배경 이미지',
    required: true,
    example: 'https://www.printshop.com',
  })
  @Column()
  backgroundImage: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
