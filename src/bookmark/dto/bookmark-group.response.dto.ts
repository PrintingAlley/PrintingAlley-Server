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
