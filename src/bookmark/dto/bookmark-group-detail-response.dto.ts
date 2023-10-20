import { ApiProperty } from '@nestjs/swagger';

class TagDto {
  @ApiProperty({ description: '태그 ID', example: 62 })
  id: number;

  @ApiProperty({ description: '태그 이름', example: '접지' })
  name: string;

  @ApiProperty({ description: '태그 이미지 URL', nullable: true })
  image: string | null;

  @ApiProperty({ description: '생성일', example: '2023-10-19T15:43:12.400Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-19T15:43:12.400Z' })
  updatedAt: string;
}

class PrintShopDto {
  @ApiProperty({ description: '인쇄소 ID', example: 10 })
  id: number;

  @ApiProperty({ description: '인쇄소 이름', example: '프린트랩' })
  name: string;

  @ApiProperty({
    description: '주소',
    example: '대구시 중구 동성로 345번길 67, 대구빌딩 6층',
  })
  address: string;

  @ApiProperty({ description: '전화번호', example: '02-732-7000' })
  phone: string;

  @ApiProperty({ description: '이메일', example: 'print@gmail.com' })
  email: string;

  @ApiProperty({
    description: '홈페이지',
    example: 'https://www.homepage.com',
  })
  homepage: string;

  @ApiProperty({ description: '대표자명', example: '홍길동' })
  representative: string;

  @ApiProperty({
    description: '인쇄소 소개',
    example: 'Composed of some 1,000 Korean Printings as members.',
  })
  introduction: string;

  @ApiProperty({
    description: '로고 이미지 URL',
    example: 'https://www.image.com/image.png',
  })
  logoImage: string;

  @ApiProperty({
    description: '배경 이미지 URL',
    example: 'https://www.image.com/image.png',
  })
  backgroundImage: string;

  @ApiProperty({ description: '위도', example: 37.5665 })
  latitude: number;

  @ApiProperty({ description: '경도', example: 126.978 })
  longitude: number;

  @ApiProperty({ description: '생성일', example: '2023-10-19T15:43:12.269Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-20T18:02:57.883Z' })
  updateAt: string;

  @ApiProperty({ description: '태그', type: () => [TagDto] })
  tags: TagDto[];
}

class BookmarkDto {
  @ApiProperty({ description: '북마크 ID', example: 7 })
  id: number;

  @ApiProperty({ description: '생성일', example: '2023-10-20T17:53:38.994Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-20T17:53:38.994Z' })
  updatedAt: string;

  @ApiProperty({ description: '인쇄소 정보', type: () => PrintShopDto })
  printShop: PrintShopDto;
}

export class BookmarkGroupDetailResponseDto {
  @ApiProperty({ description: '북마크 그룹 ID', example: 5 })
  id: number;

  @ApiProperty({ description: '그룹명', example: '기본 북마크 그룹' })
  name: string;

  @ApiProperty({ description: '생성일', example: '2023-10-20T17:28:50.521Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-20T17:28:50.521Z' })
  updatedAt: string;

  @ApiProperty({ description: '북마크 목록', type: () => [BookmarkDto] })
  bookmarks: BookmarkDto[];
}
