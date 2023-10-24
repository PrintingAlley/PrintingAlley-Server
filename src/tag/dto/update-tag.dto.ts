import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({
    description: '태그 이름',
    required: false,
    example: '소량인쇄',
  })
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  name?: string;

  @ApiProperty({
    description: '태그 이미지',
    required: false,
    example: 'https://www.printshop.com',
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}
