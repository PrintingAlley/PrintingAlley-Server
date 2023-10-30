import { ApiProperty } from '@nestjs/swagger';

class TagDtoForBookmark {
  @ApiProperty({ description: '태그 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '태그 이름', example: '명함' })
  name: string;

  @ApiProperty({ description: '태그 이미지', example: null })
  image: string | null;

  @ApiProperty({ description: '생성일', example: '2023-10-30T00:43:08.360Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T00:43:08.360Z' })
  updatedAt: string;
}

class ProductDtoForBookmark {
  @ApiProperty({ description: '제품 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '제품 이름', example: '특수컬러 명함' })
  name: string;

  @ApiProperty({ description: '가격 정보', example: null })
  priceInfo: string | null;

  @ApiProperty({
    description: '제품 소개',
    example: '스크래치에 강하고 우수한 탄성을 갖춘 7색상의 제품',
  })
  introduction: string;

  @ApiProperty({
    description: '제품 설명',
    example: '특수컬러 명함에 대한 자세한 설명',
  })
  description: string;

  @ApiProperty({
    description: '메인 이미지',
    example: 'https://www.printshop.com/image1.jpg',
  })
  mainImage: string;

  @ApiProperty({
    description: '이미지 URL 배열',
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ description: '생성일', example: '2023-10-30T00:46:02.025Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T00:46:02.025Z' })
  updateAt: string;

  @ApiProperty({ description: '태그 배열', type: () => [TagDtoForBookmark] })
  tags: TagDtoForBookmark[];
}

class BookmarkDto {
  @ApiProperty({ description: '북마크 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '생성일', example: '2023-10-30T00:54:39.832Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T00:54:39.832Z' })
  updatedAt: string;

  @ApiProperty({
    description: '제품 정보',
    type: () => ProductDtoForBookmark,
  })
  product: ProductDtoForBookmark;
}

export class BookmarkDetailSwaggerDto {
  @ApiProperty({ description: '북마크 그룹 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '북마크 그룹 이름', example: '기본 북마크 그룹' })
  name: string;

  @ApiProperty({ description: '생성일', example: '2023-10-30T00:54:35.212Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T00:54:35.212Z' })
  updatedAt: string;

  @ApiProperty({ description: '북마크 배열', type: () => [BookmarkDto] })
  bookmarks: BookmarkDto[];
}
