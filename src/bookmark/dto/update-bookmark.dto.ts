import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateBookmarkDto {
  @ApiProperty({
    description: '북마크 그룹 ID',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  groupId: number;
}
