import { ApiProperty } from '@nestjs/swagger';
import { BookmarkGroup } from 'src/entity/bookmark-group.entity';

export class BookmarkGroupsResponseDto {
  @ApiProperty({
    description: '북마크 그룹 목록',
    type: [BookmarkGroup],
  })
  bookmarkGroups: BookmarkGroup[];
}

export class BookmarkGroupResponseDto {
  @ApiProperty({
    description: '북마크 그룹',
    type: BookmarkGroup,
  })
  bookmarkGroup: BookmarkGroup;
}

export class BookmarkGroupWithHasProduct {
  @ApiProperty({
    description: '북마크 그룹 ID',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '북마크 그룹 이름',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: '북마크 그룹에 제품이 있는지 여부',
    type: Boolean,
  })
  hasProduct: boolean;

  @ApiProperty({
    description: '해당 북마크 ID',
    type: Number,
  })
  bookmarkId?: number;

  @ApiProperty({
    description: '북마크 개수',
    type: Number,
  })
  bookmarkCount?: number;

  @ApiProperty({
    description: '최근 북마크 이미지 URL',
    type: String,
  })
  recentImage?: string;
}

export class BookmarkGroupsWithHasProductResponseDto {
  @ApiProperty({
    description: '북마크 그룹 목록',
    type: [BookmarkGroupWithHasProduct],
  })
  bookmarkGroups: BookmarkGroupWithHasProduct[];
}
