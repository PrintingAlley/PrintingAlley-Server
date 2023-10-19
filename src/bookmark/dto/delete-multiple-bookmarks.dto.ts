import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class DeleteMultipleBookmarksDto {
  @ApiProperty({
    description: '북마크 ID들',
    required: true,
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  bookmarkIds: number[];
}
