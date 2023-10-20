import { ApiProperty } from '@nestjs/swagger';

export class BookmarkGroupResponseDto {
  @ApiProperty({ description: '북마크 그룹 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '그룹명', example: '기본 북마크 그룹' })
  name: string;

  @ApiProperty({ description: '생성일', example: '2023-10-20T17:28:50.521Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-20T17:28:50.521Z' })
  updatedAt: string;

  @ApiProperty({ description: '북마크 수', example: 1 })
  bookmarkCount: number;
}
