import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateBookmarkGroupDto {
  @ApiProperty({
    description: '그룹명',
    required: true,
    example: '내 주변 인쇄소',
  })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  name: string;
}
