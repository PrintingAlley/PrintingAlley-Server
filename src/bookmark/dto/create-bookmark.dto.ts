import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty({
    description: '인쇄소 ID',
    required: true,
    example: 1,
  })
  printShopId: number;

  @ApiProperty({
    description: '북마크 그룹 ID, 없으면 기본 그룹으로 지정',
    required: false,
  })
  bookmarkGroupId?: number;
}
