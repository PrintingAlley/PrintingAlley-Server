import { ApiProperty } from '@nestjs/swagger';
import { SimpleBookmarkGroupSwaggerDto } from './simple-bookmark-group.swagger.dto';
import { ProductSwaggerDto } from 'src/product/dto/swagger/product-response.swagger.dto';

export class BookmarkGroupListSwaggerDto {
  @ApiProperty({
    description: '북마크 그룹 목록',
    type: [SimpleBookmarkGroupSwaggerDto],
  })
  bookmarkGroups: SimpleBookmarkGroupSwaggerDto[];
}

class BookmarkSwaggerDto {
  @ApiProperty({ description: '북마크 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '생성일', example: '2023-10-31T03:13:46.219Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-31T03:13:46.219Z' })
  updatedAt: string;

  @ApiProperty({ description: '제품 정보', type: ProductSwaggerDto })
  product: ProductSwaggerDto;
}

class BookmarkGroupSwaggerDto {
  @ApiProperty({ description: '북마크 그룹 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '북마크 그룹 이름', example: '기본 북마크 그룹' })
  name: string;

  @ApiProperty({ description: '생성일', example: '2023-10-31T03:13:46.205Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-31T03:13:46.205Z' })
  updatedAt: string;

  @ApiProperty({
    description: '북마크 목록',
    type: [BookmarkSwaggerDto],
  })
  bookmarks: BookmarkSwaggerDto[];
}

export class BookmarkGroupDetailSwaggerDto {
  @ApiProperty({
    description: '북마크 그룹 상세 정보',
    type: BookmarkGroupSwaggerDto,
  })
  bookmarkGroup: BookmarkGroupSwaggerDto;
}
