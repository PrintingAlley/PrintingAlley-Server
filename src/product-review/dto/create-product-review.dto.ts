import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductReviewDto {
  @ApiProperty({
    description: '리뷰 내용',
    required: true,
    example: '리뷰 내용입니다.',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: '별점',
    required: true,
    example: 4,
  })
  @IsNotEmpty()
  @IsInt()
  rating: number;

  @ApiProperty({
    description: '이미지 URL 배열',
    required: false,
    example: ['https://www.printshop.com'],
  })
  @IsOptional()
  @IsArray()
  images?: string[];
}
