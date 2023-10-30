import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: '새로운 이름',
    required: false,
    example: '홍길동',
  })
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  name?: string;

  @ApiProperty({
    description: '새로운 프로필 이미지 URL',
    required: false,
    example: 'https://www.printshop.com',
  })
  @IsOptional()
  profileImage?: string;
}
