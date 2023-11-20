import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDtoByAdmin {
  @ApiProperty({
    description: '제품명',
    required: true,
    example: '특수컬러 명함',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '제품 크기',
    required: true,
    example: '90*50mm',
  })
  @IsNotEmpty()
  size: string;

  @ApiProperty({
    description: '종이 종류',
    required: true,
    example: '종이이름+평량(g)',
  })
  @IsOptional()
  paper: string;

  @ApiProperty({
    description: '디자이너 또는 디자인 스튜디오 이름',
    required: true,
    example: '프린팅 스튜디오',
  })
  @IsOptional()
  designer: string;

  @ApiProperty({
    description: '제품 소개',
    required: true,
    example: '간단한 제품 소개',
  })
  @IsOptional()
  introduction: string;

  @ApiProperty({
    description: '제품 설명',
    required: true,
    example: '제품 설명',
  })
  @IsOptional()
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

  @ApiProperty({
    description: '인쇄사 ID',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  printShopId: number;
}
