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
    description: '제품 크기',
    required: true,
    example: '90*50mm',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  size: string;

  @ApiProperty({
    description: '종이 종류',
    required: true,
    example: '종이이름+평량(g)',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  paper: string;

  @ApiProperty({
    description: '후가공',
    required: true,
    example: '도무송',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  afterProcess: string;

  @ApiProperty({
    description: '디자이너 또는 디자인 스튜디오 이름',
    required: true,
    example: '프린팅 스튜디오',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  designer: string;

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
  @MaxLength(50000)
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
    description: '태그 ID 목록',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];
}
