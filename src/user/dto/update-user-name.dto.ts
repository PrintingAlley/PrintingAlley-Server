import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserNameDto {
  @ApiProperty({
    description: '새로운 이름',
    required: true,
    example: '홍길동',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  name: string;
}
