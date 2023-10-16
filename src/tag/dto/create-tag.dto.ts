import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: '태그 이름',
    required: true,
    example: '소량인쇄',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    description: '태그 이미지',
    required: false,
    example: 'https://www.printshop.com',
  })
  @IsUrl()
  image?: string;

  @ApiProperty({
    description: '부모 태그 ID',
    required: false,
    example: 1,
  })
  parentId?: number;
}
