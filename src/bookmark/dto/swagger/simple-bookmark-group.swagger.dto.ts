import { ApiProperty } from '@nestjs/swagger';

export class SimpleBookmarkGroupSwaggerDto {
  @ApiProperty({ description: '북마크 그룹 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '북마크 그룹 이름', example: '기본 북마크 그룹' })
  name: string;

  @ApiProperty({ description: '생성일', example: '2023-10-31T03:13:46.205Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-31T03:13:46.205Z' })
  updatedAt: string;

  @ApiProperty({ description: '북마크 수', example: 1 })
  bookmarkCount: number;
}
