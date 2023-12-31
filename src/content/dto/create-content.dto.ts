import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({
    description: '콘텐츠 제목',
    required: true,
    example: '새로운 콘텐츠',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: '콘텐츠 내용',
    required: true,
    example: '콘텐츠 내용입니다.',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50000)
  content: string;

  @ApiProperty({
    description: '콘텐츠 썸네일 이미지',
    required: false,
    example: 'https://www.printshop.com',
  })
  @IsOptional()
  thumbnail?: string;
}
