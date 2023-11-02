import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: '카테고리명',
    required: true,
    example: '명함',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    description: '카테고리 이미지',
    required: false,
    example: 'https://www.google.com',
  })
  @IsOptional()
  image?: string;
}
