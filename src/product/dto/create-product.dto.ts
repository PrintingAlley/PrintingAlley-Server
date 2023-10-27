import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: '제품명',
    required: true,
    example: '특수컬러 명함',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: '제품 가격 정보',
    required: false,
    example: '100장에 10,000원',
  })
  @IsOptional()
  priceInfo?: string;

  @ApiProperty({
    description: '제품 소개',
    required: true,
    example: '간단한 제품 소개',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2000)
  introduction: string;

  @ApiProperty({
    description: '제품 설명',
    required: true,
    example: '제품 설명',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2000)
  description: string;

  @ApiProperty({
    description: '제품 메인 이미지',
    required: true,
    example: 'https://www.printshop.com/image1.jpg',
  })
  @IsNotEmpty()
  mainImage: string;

  @ApiProperty({
    description: '제품 이미지들',
    required: false,
    example: ['https://www.printshop.com/image1.jpg'],
  })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: '제품 카테고리 ID',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @ApiProperty({
    description: '인쇄사 ID',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  printShopId: number;

  @ApiProperty({
    description: '태그 ID 목록',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];
}
