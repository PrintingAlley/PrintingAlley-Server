import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class DeleteMultipleGroupsDto {
  @ApiProperty({
    description: '북마크 그룹 ID들',
    required: true,
    example: [1, 2, 3],
  })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  groupIds: number[];
}
