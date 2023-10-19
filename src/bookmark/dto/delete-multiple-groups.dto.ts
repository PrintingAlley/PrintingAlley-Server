import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class DeleteMultipleGroupsDto {
  @ApiProperty({
    description: '북마크 그룹 ID들',
    required: true,
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  groupIds: number[];
}
